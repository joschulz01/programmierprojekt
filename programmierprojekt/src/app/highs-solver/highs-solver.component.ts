import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import highs, { HighsSolution } from 'highs';
import { ConstraintsService } from '../constraints.service';
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';
import { TranslationService } from '../translationservice';

interface Column {
  Name: string;
  Index: number;
  Status: string;
  Lower: number;
  Upper?: number;
  Primal?: number; 
  Dual?: number; 
  Type: string;
}

interface Row {
  Name: string;
  Index: number;
  Status: string;
  Lower?: number; 
  Upper: number; 
  Primal?: number; 
  Dual?: number; 
}

interface Result {
  Columns: Record<string, Column>; 
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
  problemInput = '';  
  solution = '';  
  result: Result | null = null; 
  selectedFile: File | null = null; 
  showInfo = false;
  elapsedTime: number | null = null;
  preparationTime: number | null = null;
  errorMessage: string | null = null;

  switchLanguage() {
    this.translationService.switchLanguage();
  }

  xWert?: number;
  yWert?: number;

  constructor(private constraintsService: ConstraintsService, private umformungService: UmformungService, public translationService: TranslationService) {}
  
  async solveProblem(): Promise<void> {
    this.errorMessage = ''
    this.solution = '';
    this.result = null;
    this.xWert = undefined;
    this.yWert = undefined;

    const LP = this.umformungService.umformen(this.problemInput);
    const LP_neu=this.umformungService.umformenxy(this.problemInput);
 
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}` 
    }
    if (!this.problemInput ) {
      this.errorMessage = this.translationService.getTranslation('error2');
      return;
  };
  const trimmedInput = this.problemInput.trim();
    if (!trimmedInput.startsWith('Maximize') && !trimmedInput.startsWith('Minimize') && !trimmedInput.startsWith('var')) {
        this.errorMessage = this.translationService.getTranslation('error1');
        return;
    }

    const preparationStartTime = performance.now();
    const preparationEndTime = performance.now();
    this.preparationTime = preparationEndTime - preparationStartTime;
    const startTime = performance.now();

    try {
      const highsSolver = await highs(highs_settings);
      let highsResult: HighsSolution; 
      let constraints;
      try {
        highsResult = await highsSolver.solve(this.problemInput); 
        constraints = this.extractConstraints(this.problemInput);
      } catch (error) {
        console.log('Fehler beim L�sen des Problems:', error, "\nMit umgeformtem Input");
        highsResult = await highsSolver.solve(LP); 
        constraints = this.extractConstraints(LP_neu);
      }

      this.result = this.convertToResult(highsResult);
      this.constraintsService.setConstraints(constraints);
      this.constraintsService.constraintsUpdated.next()
      this.solution = JSON.stringify(this.result, null, 2);

      // Laufzeitanalyse
      const endTime = performance.now();
      this.elapsedTime = endTime - startTime; 

      this.WerteErmitteln(this.result);
    } catch (error) {
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
            Lower: column.Lower ?? 0, 
            Upper: column.Upper ?? Infinity, 
            Primal: column.Primal ?? undefined, 
            Dual: column.Dual ?? undefined, 
            Type: column.Type,
        };
    }

    // Verarbeitung der Zeilen
    for (const row of highsResult.Rows) {
        const newRow: Row = {
            Name: `Row ${row.Index}`, 
            Index: row.Index,
            Status: 'Status' in row ? row.Status : 'Unknown', 
            Lower: row.Lower ?? 0, 
            Upper: row.Upper ?? Infinity, 
            Primal: undefined, 
            Dual: undefined, 
        };
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

  WerteErmitteln(result: Result) { 
    const VariableX = result.Columns['x'] || result.Columns['x1'];
    if (VariableX && 'Primal' in VariableX) {
      this.xWert = VariableX.Primal;
    }

    const VariableY = result.Columns['y'] || result.Columns['x2'];
    if (VariableY && 'Primal' in VariableY) {
      this.yWert = VariableY.Primal; 
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
isValidInput(): boolean {
  const Reihe = this.result?.Rows.length || 0;  // Anzahl der Rows in das Variable Reihe speichern

  if (Reihe <= 2) {
    return true;  // G�ltig, wenn 2 oder weniger Reihen vorhanden sind
  } else {
    return false; // Ung�ltig, wenn mehr als 2 Reihen vorhanden sind
  }
}
}
