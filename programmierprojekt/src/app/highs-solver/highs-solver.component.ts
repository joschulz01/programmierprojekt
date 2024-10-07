import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import highs, { HighsSolution } from 'highs'; // Importiere HighsSolution
import { ConstraintsService } from '../constraints.service';
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';
import { TranslationService } from '../translationservice';

// Definition der Interfaces f�r den Resultattyp
interface Column {
  Name: string;
  Index: number;
  Status: string;
  Lower: number;
  Upper?: number;
  Primal?: number; // Optional
  Dual?: number; // Optional
  Type: string;
}

interface Row {
  Name: string;
  Index: number;
  Status: string;
  Lower?: number; // Optional
  Upper: number; // Muss vorhanden sein
  Primal?: number; // Optional
  Dual?: number; // Optional
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
  problemInput = '';  // Eingabefeld f�r das Problem, standardm��ig leer
  solution = '';  // Variable zur Anzeige der L�sung
  result: Result | null = null; // Verwendung des definierten Result Interfaces
  selectedFile: File | null = null; // Hier wird die ausgewählte Datei 
  showInfo = false; //Kontrolliert das Anzeigen des Tooltips
  elapsedTime: number | null = null;
  preparationTime: number | null = null;

  switchLanguage() {
    this.translationService.switchLanguage();
  }

  xWert?: number;
  yWert?: number;

  constructor(private constraintsService: ConstraintsService, private umformungService: UmformungService, public translationService: TranslationService) {}

  // Methode zur L�sung des Benutzerproblems
  async solveProblem(): Promise<void> {
    const LP = this.umformungService.umformen(this.problemInput);
    // Initialisiere den HiGHS Solver und passe locateFile an
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}` // Zeigt auf den Ordner, wo die WASM-Datei liegt
    };

    const preparationStartTime = performance.now();
    const preparationEndTime = performance.now();
    this.preparationTime = preparationEndTime - preparationStartTime;

    const startTime = performance.now();
    let highsResult: HighsSolution | null = null;

    try {
      // HiGHS-Solver mit den definierten Einstellungen laden
      const highsSolver = await highs(highs_settings);
      let highsResult: HighsSolution; // Typ f�r das HiGHS-Ergebnis festlegen

      // L�sen des vom Benutzer eingegebenen Problems
      let constraints;
      try {
        highsResult = await highsSolver.solve(this.problemInput); // Async-Funktion aufrufen
        constraints = this.extractConstraints(this.problemInput);
      } catch (error) {
        console.log('Fehler beim L�sen des Problems:', error, "\nMit umgeformtem Input");
        highsResult = await highsSolver.solve(LP); // Async-Funktion aufrufen
        constraints = this.extractConstraints(LP);
      }

      // Konvertiere das HiGHS-Ergebnis in dein Result-Format
      this.result = this.convertToResult(highsResult);
      
      // F�ge die Constraints in den ConstraintsService hinzu
      this.constraintsService.setConstraints(constraints);
      this.constraintsService.constraintsUpdated.next();

      // Ergebnis als JSON speichern und anzeigen
      this.solution = JSON.stringify(this.result, null, 2);

 // Laufzeitanalyse
 const endTime = performance.now(); // Endzeit für die Laufzeitanalyse
 this.elapsedTime = endTime - startTime; // Berechne die Laufzeit
 
      // Werte f�r x und y ermitteln
      this.WerteErmitteln(this.result);
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim L�sen des Problems:', error);
      this.solution = 'Fehler beim L�sen des Problems: ' + error;
    }
  }

  private convertToResult(highsResult: HighsSolution): Result {
    const columns: Record<string, Column> = {};
    const rows: Row[] = [];

    // Verarbeitung der Spalten
    for (const [name, column] of Object.entries(highsResult.Columns)) {
        columns[name] = {
            Name: name,
            Index: column.Index,
            Status: column.Status,
            Lower: column.Lower ?? 0, // Setze einen Standardwert, falls null
            Upper: column.Upper ?? Infinity, // Setze einen Standardwert, falls null
            Primal: column.Primal ?? undefined, // Setze auf undefined, wenn null
            Dual: column.Dual ?? undefined, // Setze auf undefined, wenn null
            Type: column.Type,
        };
    }

    // Verarbeitung der Zeilen
    for (const row of highsResult.Rows) {
        const newRow: Row = {
            Name: `Row ${row.Index}`, // Standardname verwenden
            Index: row.Index,
            Status: 'Status' in row ? row.Status : 'Unknown', // Setze auf 'Unknown' wenn Status nicht existiert
            Lower: row.Lower ?? 0, // Setze einen Standardwert, falls null
            Upper: row.Upper ?? Infinity, // Setze einen Standardwert, falls null
            Primal: undefined, // Setze auf undefined, weil nicht immer verf�gbar
            Dual: undefined, // Setze auf undefined, weil nicht immer verf�gbar
        };

        // �berpr�fung auf die Existenz von Primal und Dual
        if ('Primal' in row) {
            newRow.Primal = row.Primal;
        }
        if ('Dual' in row) {
            newRow.Dual = row.Dual;
        }

        rows.push(newRow);
    }

    return {
        Columns: columns,
        Rows: rows,
        ObjectiveValue: highsResult.ObjectiveValue,
    };
}




  WerteErmitteln(result: Result) { // Typ f�r result festlegen
    const VariableX = result.Columns['x'] || result.Columns['x1'];
    if (VariableX && 'Primal' in VariableX) {
      this.xWert = VariableX.Primal; // Setze den Wert f�r xWert
    }
    
    const VariableY = result.Columns['y'] || result.Columns['x2'];
    if (VariableY && 'Primal' in VariableY) {
      this.yWert = VariableY.Primal; // Setze den Wert f�r yWert
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
        continue; // �berspringe die Zeilen bis wir die Constraints erreichen
      }
      if (trimmedLine.startsWith('Subject To')) {
        continue; // �berspringe diese Zeile
      }
      if (trimmedLine.startsWith('Bounds')) {
        break; // Wir haben alle Constraints gelesen
      }

      // Hier wird die Zeile als Constraint geparst
      const parts = trimmedLine.split(/<=|>=|=/);
      if (parts.length < 2) {
        continue; // Ung�ltige Zeile, �berspringen
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
    const termRegex = /([-+]?\d*\.?\d+)?\s*([xy]\d+)/g; // Beispiel f�r Variablen x1, x2, ...
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

  // Funktion zum Erstellen einer Datei und Herunterladen
  private downloadFile(data: string, filename: string, type: string) {
    const blob = new Blob([data], { type: type });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

//Import
importFile(): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.mps, .lp, .gmu, .glpk';
  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.problemInput = (e.target?.result as string) || ''; // Speichere den Inhalt der Datei
      };
      reader.readAsText(selectedFile); // Lese die Datei als Text
    } else {
      alert('Keine Datei ausgewählt.'); // Warnung, wenn keine Datei ausgewählt ist
    }
  };
  input.click(); // Öffne den Dateiauswahldialog
  
}
}