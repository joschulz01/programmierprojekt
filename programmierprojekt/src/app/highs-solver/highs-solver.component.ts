import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import highs from 'highs';
import { ConstraintsService } from '../constraints.service';
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';

@Component({
  selector: 'app-highs-solver',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelComponent],
  templateUrl: './highs-solver.component.html',
  styleUrls: ['./highs-solver.component.css']
})
export class HighsSolverComponent {
  problemInput = '';  // Eingabefeld für das Problem, standardmäßig leer
  solution = '';  // Variable zur Anzeige der Lösung
  result: { 
    Columns: { 
      [key: string]: { 
        Name: string; 
        Index: number; 
        Status: string; 
        Lower: number; 
        Upper?: number; 
        Primal: number; 
        Dual: number; 
        Type: string; 
      }; 
    }; 
    Rows: { 
      Name: string; 
      Index: number; 
      Status: string; 
      Lower?: number; 
      Upper: number; 
      Primal: number; 
      Dual: number; 
    }[]; 
    ObjectiveValue: number; 
  } | null = null;

  xWert?: number;
  yWert?: number;

  constructor(private constraintsService: ConstraintsService, private umformungService: UmformungService) {}

  // Methode zur Lösung des Benutzerproblems
  async solveProblem(): Promise<void> {
    const LP = this.umformungService.umformen(this.problemInput);
   

    // Initialisiere den HiGHS Solver und passe locateFile an
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}` // Zeigt auf den Ordner, wo die WASM-Datei liegt
    };

    try {
      // HiGHS-Solver mit den definierten Einstellungen laden
      const highsSolver = await highs(highs_settings);
      let result: any;

      // Lösen des vom Benutzer eingegebenen Problems
      let constraints
      try {
        result = highsSolver.solve(this.problemInput);
        constraints = this.extractConstraints(this.problemInput);
      } catch (error) {
        result = highsSolver.solve(LP);
        constraints = this.extractConstraints(LP);
      }

      // Füge die Constraints in den ConstraintsService hinzu
      console.log("Hier: ",constraints);
      this.constraintsService.setConstraints(constraints);
      this.constraintsService.constraintsUpdated.next();  

      // Ergebnis als JSON speichern und anzeigen
      this.result = result;
      this.solution = JSON.stringify(result, null, 2);

      // Werte für x und y ermitteln
      this.WerteErmitteln(result);
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Lösen des Problems:', error);
      this.solution = 'Fehler beim Lösen des Problems: ' + error;
    }
  }

  WerteErmitteln(result: any) {
    const VariableX = result.Columns['x'] || result.Columns['x1'];
    if (VariableX && 'Primal' in VariableX) {
      this.xWert = VariableX.Primal; // Setze den Wert für xWert
    }
    
    const VariableY = result.Columns['y'] || result.Columns['x2'];
    if (VariableY && 'Primal' in VariableY) {
      this.yWert = VariableY.Primal; // Setze den Wert für yWert
    }
  }

  // Methode zum Extrahieren der Constraints aus dem Problemstring
  private extractConstraints(problem: string): any[] {
    const constraints: any[] = [];
    const lines = problem.split('\n').filter(line => line.trim() !== '');

    let isObjective = true; // Flag zum Erkennen, ob wir noch im Zielbereich sind
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Maximize') || trimmedLine.startsWith('Minimize')) {
        isObjective = false; // Wechsel zu den Constraints
        continue;
      }
      if (isObjective) {
        continue; // Überspringe die Zeilen bis wir die Constraints erreichen
      }
      if (trimmedLine.startsWith('Subject To')) {
        continue; // Überspringe diese Zeile
      }
      if (trimmedLine.startsWith('Bounds')) {
        break; // Wir haben alle Constraints gelesen
      }

      // Hier wird die Zeile als Constraint geparst
      const parts = trimmedLine.split(/<=|>=|=/);
      if (parts.length < 2) {
        continue; // Ungültige Zeile, überspringen
      }

      const lhs = this.normalizeVariableNames(parts[0].trim());
      const rhs = parts[1].trim();
      const relation = trimmedLine.includes('<=') ? '<=' : trimmedLine.includes('>=') ? '>=' : '=';
      constraints.push({
        name: `Constraint ${constraints.length + 1}`, // Benennung der Constraints
        terms: this.parseTerms(lhs),
        relation: relation,
        rhs: parseFloat(rhs),
      });
    }

    return constraints;
  }

  private normalizeVariableNames(expression: string): string {
    return expression.replace(/\s+(\d+)/g, '$1');  // Entfernt Leerzeichen zwischen Variablen und Zahlen, z.B. "x 1" wird zu "x1"
  }
  // Hilfsmethode zum Parsen der Terme einer Constraint
  private parseTerms(lhs: string): { name: string; coef: number }[] {
    const terms: { name: string; coef: number }[] = [];
    const termRegex = /([-+]?\d*\.?\d+)?\s*([xy]\d+)/g; // Beispiel für Variablen x1, x2, ...
    let match: RegExpExecArray | null;

    while ((match = termRegex.exec(lhs)) !== null) {
      const coef = match[1] ? parseFloat(match[1]) : 1; // Falls kein Koeffizient angegeben ist, nehme 1
      const variable = match[2];
      terms.push({ name: variable, coef: coef });
    }

    return terms;
  }
}
