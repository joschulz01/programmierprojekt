import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConstraintsService } from '../constraints.service';
import highs, { HighsSolution } from 'highs'; // Importiere HighsSolution
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';
import { TranslationService } from '../translationservice';

// Definition der Interfaces für den Resultattyp
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
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})
export class ParameterComponent {

  errorMessage: string | null = null;  // Fehlernachricht
  numVariables = 0;
  variables: string[] = [];
  objectiveFunction = '';
  constraints: string[] = [];
  problemInput = '';  // Eingabefeld für das Problem, standardmäßig leer
  solution = '';  // Variable zur Anzeige der Lösung
  result: Result | null = null; // Verwendung des definierten Result Interfaces
  selectedFile: File | null = null; // Hier wird die ausgewählte Datei
  showInfo = false; // Kontrolliert das Anzeigen des Tooltips
  elapsedTime: number | null = null;
  preparationTime: number | null = null;
  optimizationType: 'Maximize' | 'Minimize' = 'Maximize';


  switchLanguage() {
    this.translationService.switchLanguage();
  }

  generateVariableInputs() {
    this.variables = new Array(this.numVariables).fill('');
  }

  addConstraint() {
    this.constraints.push(''); // Leeres Feld für die neue Nebenbedingung
  }

  removeConstraint(index: number) {
    this.constraints.splice(index, 1); // Entfernt die Nebenbedingung an der gegebenen Position
  }

  trackByIndex(index: number): number {
    return index;
  }

  xWert?: number;
  yWert?: number;

  constructor(
    private constraintsService: ConstraintsService,
    private umformungService: UmformungService,
    public translationService: TranslationService
  ) {}

  async solveProblem(): Promise<void> {
    if (!this.objectiveFunction || this.constraints.length === 0) {
      this.errorMessage = 'Bitte geben Sie eine Zielfunktion und mindestens eine Nebenbedingung ein.';
      return;
    }

    if (!this.numVariables || this.variables.some(v => !v) || !this.objectiveFunction || this.constraints.some(c => !c)) {
      this.errorMessage = 'Bitte alle Felder ausfüllen';
      return;
    }

    const LP = this.umformungService.umformen(this.problemInput);
    // Initialisiere den HiGHS Solver und passe locateFile an
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}` // Zeigt auf den Ordner, wo die WASM-Datei liegt
    };

    const preparationStartTime = performance.now();
    const preparationEndTime = performance.now();
    this.preparationTime = preparationEndTime - preparationStartTime;

    const startTime = performance.now();

    try {
      // HiGHS-Solver mit den definierten Einstellungen laden
      const highsSolver = await highs(highs_settings);
      let highsResult: HighsSolution; // Typ für das HiGHS-Ergebnis festlegen

      // Lösen des vom Benutzer eingegebenen Problems
      let parsedConstraints;
      try {
        highsResult = await highsSolver.solve(this.problemInput); // Async-Funktion aufrufen
        parsedConstraints = this.extractConstraints(this.problemInput);
      } catch (error) {
        console.log('Fehler beim Lösen des Problems:', error, "\nMit umgeformtem Input");
        highsResult = await highsSolver.solve(LP); // Async-Funktion aufrufen
        parsedConstraints = this.extractConstraints(LP);
      }

      // Konvertiere das HiGHS-Ergebnis in dein Result-Format
      this.result = this.convertToResult(highsResult);

      // Füge die Constraints in den ConstraintsService hinzu
      this.constraintsService.setConstraints(parsedConstraints);
      this.constraintsService.constraintsUpdated.next();

      // Ergebnis als JSON speichern und anzeigen
      this.solution = JSON.stringify(this.result, null, 2);

      // Laufzeitanalyse
      const endTime = performance.now(); // Endzeit für die Laufzeitanalyse
      this.elapsedTime = endTime - startTime; // Berechne die Laufzeit

      // Werte für x und y ermitteln
      this.WerteErmitteln(this.result);
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Lösen des Problems:', error);
      this.solution = 'Fehler beim Lösen des Problems: ' + error;
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
        Primal: undefined, // Setze auf undefined, weil nicht immer verfügbar
        Dual: undefined, // Setze auf undefined, weil nicht immer verfügbar
      };

      // Überprüfung auf die Existenz von Primal und Dual
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
    const constraintsParsed: { name: string; terms: { name: string; coef: number }[]; relation: string; rhs: number; }[] = [];
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
        continue; // Ungültige Zeile überspringen
      }

      const lhs = parts[0].trim();
      const rhs = parseFloat(parts[1].trim());
      const relationMatch = trimmedLine.match(/(<=|>=|=)/);
      const relation = relationMatch ? relationMatch[0] : '=';

      const terms = lhs.split('+').map(term => {
        const [coefStr, name] = term.trim().split(' ');
        const coef = parseFloat(coefStr);
        return { name: name.trim(), coef: isNaN(coef) ? 1 : coef }; // Verwende 1, falls der Koeffizient nicht angegeben ist
      });

      constraintsParsed.push({
        name: `Constraint ${constraintsParsed.length + 1}`,
        terms,
        relation,
        rhs
      });
    }

    return constraintsParsed;
  }

  //private normalizeVariableNames(expression: string): string {
  //  return expression.replace(/\s+(\d+)/g, '$1');  // Entfernt Leerzeichen zwischen Variablen und Zahlen, z.B. "x 1" wird zu "x1"
  //}

  // Hilfsmethode zum Parsen der Terme einer Constraint
  //private parseTerms(lhs: string): { name: string; coef: number }[] {
  //  const terms: { name: string; coef: number }[] = [];
  //  const termRegex = /([-+]?\d*\.?\d+)?\s*([xy]\d+)/g; // Beispiel für Variablen x1, x2, ...
  //  let match: RegExpExecArray | null;

  //  while ((match = termRegex.exec(lhs)) !== null) {
  //    const coef = match[1] ? parseFloat(match[1]) : 1; // Falls kein Koeffizient angegeben ist, nehme 1
  //    const variable = match[2];
  //    terms.push({ name: variable, coef: coef });
  //  }

  //  return terms;
  //}

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
}
