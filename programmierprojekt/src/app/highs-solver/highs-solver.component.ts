import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import highs, { HighsSolution } from 'highs'; // Importiere HighsSolution
import { ConstraintsService } from '../constraints.service';
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';

// Definition der Interfaces für den Resultattyp
interface Column {
  Name: string;
  Index: number;
  Status: string;
  Lower: number;
  Upper?: number;
  Primal: number;
  Dual: number;
  Type: string;
}

interface Row {
  Name: string;
  Index: number;
  Status: string;
  Lower?: number;
  Upper: number;
  Primal: number;
  Dual: number;
}

interface Result {
  Columns: Record<string, Column>; // Verwendung von Record anstelle von Indexsignatur
  Rows: Row[];
  ObjectiveValue: number;
}

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
  result: Result | null = null; // Verwendung des definierten Result Interfaces

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
      let highsResult: HighsSolution; // Typ für das HiGHS-Ergebnis festlegen

      // Lösen des vom Benutzer eingegebenen Problems
      let constraints;
      try {
        highsResult = await highsSolver.solve(this.problemInput); // Async-Funktion aufrufen
        constraints = this.extractConstraints(this.problemInput);
      } catch (error) {
        console.log('Fehler beim Lösen des Problems:', error, "\nMit umgeformtem Input");
        highsResult = await highsSolver.solve(LP); // Async-Funktion aufrufen
        constraints = this.extractConstraints(LP);
      }

      // Konvertiere das HiGHS-Ergebnis in dein Result-Format
      this.result = this.convertToResult(highsResult);
      
      // Füge die Constraints in den ConstraintsService hinzu
      this.constraintsService.setConstraints(constraints);
      this.constraintsService.constraintsUpdated.next();

      // Ergebnis als JSON speichern und anzeigen
      this.solution = JSON.stringify(this.result, null, 2);

      // Werte für x und y ermitteln
      this.WerteErmitteln(this.result);
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Lösen des Problems:', error);
      this.solution = 'Fehler beim Lösen des Problems: ' + error;
    }
  }

  // Methode zur Konvertierung von HighsSolution zu Result
  private convertToResult(highsResult: HighsSolution): Result {
    const columns: Record<string, Column> = {};
    const rows: Row[] = [];

    for (const [name, column] of Object.entries(highsResult.Columns)) {
      columns[name] = {
        Name: name,
        Index: column.Index,
        Status: column.Status,
        Lower: column.Lower,
        Upper: column.Upper,
        Primal: column.Primal,
        Dual: column.Dual,
        Type: column.Type,
      };
    }

    for (const row of highsResult.Rows) {
      rows.push({
        Name: row.Name,
        Index: row.Index,
        Status: row.Status,
        Lower: row.Lower,
        Upper: row.Upper,
        Primal: row.Primal,
        Dual: row.Dual,
      });
    }

    return {
      Columns: columns,
      Rows: rows,
      ObjectiveValue: highsResult.ObjectiveValue,
    };
  }

  WerteErmitteln(result: Result) { // Typ für result festlegen
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
  private extractConstraints(problem: string): { name: string; terms: { name: string; coef: number }[]; relation: string; rhs: number; }[] {
    const constraints: { name: string; terms: { name: string; coef: number }[]; relation: string; rhs: number; }[] = [];
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

  // === EXPORT FUNCTIONALITY ===

  // Exportiere das Modell als LP-Datei basierend auf der Benutzereingabe
  downloadLP() {
    const lpData = this.problemInput; // Benutzereingabe verwenden
    this.downloadFile(lpData, 'model.lp', 'text/plain');
  }

  // Exportiere das Modell als MPS-Datei basierend auf der Benutzereingabe
  downloadMPS() {
    const mpsData = this.problemInput; // Benutzereingabe verwenden
    this.downloadFile(mpsData, 'model.mps', 'text/plain');
  }

  // Funktion zum Erstellen einer Download-Datei
  downloadFile(data: string, filename: string, filetype: string) {
    const blob = new Blob([data], { type: filetype });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
