import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConstraintsService } from '../constraints.service';
import highs, { HighsSolution } from 'highs';
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
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})

export class ParameterComponent {

  errorMessage: string | null = null;
  numVariables = 0;
  variables: string[] = [];
  objectiveFunction = '';
  constraints: string[] = [];
  problemInput = '';
  solution = '';
  result: Result | null = null;
  selectedFile: File | null = null;
  showInfo = false;
  elapsedTime: number | null = null;
  preparationTime: number | null = null;

  optimizationType = 'Maximize';

  xWert?: number;
  yWert?: number;

  constructor(private constraintsService: ConstraintsService, private umformungService: UmformungService, public translationService: TranslationService) {}

  ngOnInit(): void {
    // Sicherstellen, dass mindestens ein Variablenfeld vorhanden ist
    if (this.variables.length === 0) {
      this.variables.push('');
    }

    // Sicherstellen, dass mindestens ein Nebenbedingungenfeld vorhanden ist
    if (this.constraints.length === 0) {
      this.constraints.push('');
    }
  }


  switchLanguage() {
    this.translationService.switchLanguage();
  }

  generateVariableInputs() {
    this.variables = new Array(this.numVariables).fill('');
  }

  addConstraint() {
    this.constraints.push('');
  }

  removeConstraint(index: number) {
    this.constraints.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  // Angepasste Methode zum Erstellen der Problemdefinition
  private buildProblemInput() {
    let problemStr = '';

    // Bereinige die Zielfunktion
    let cleanedObjective = this.objectiveFunction.trim();

    // Entferne 'maximize', 'minimize' und 'Objective:' aus der Zielfunktion
    cleanedObjective = cleanedObjective.replace(/(maximize|minimize)/i, '');
    cleanedObjective = cleanedObjective.replace(/Objective:/i, '');
    // Entferne alle '*' Zeichen
    cleanedObjective = cleanedObjective.replace(/\*/g, '');
    // Entferne Leerzeichen zwischen Zahlen und Variablen
    cleanedObjective = cleanedObjective.replace(/(\d)\s+([a-zA-Z])/g, '$1$2');
    // Entferne doppelte Leerzeichen
    cleanedObjective = cleanedObjective.replace(/\s+/g, ' ').trim();

    // Füge den Optimierungstyp hinzu ('Maximize' oder 'Minimize')
    problemStr += this.optimizationType + '\n';
    problemStr += ' obj: ' + cleanedObjective + '\n';

    // Constraints
    problemStr += 'Subject To\n';
    // Anpassung der Schleife: Verwenden von 'for-of' mit 'entries()' um Index und Wert zu erhalten
    for (const [index, constraintRaw] of this.constraints.entries()) {
      let constraint = constraintRaw.trim();
      // Entferne '*' Zeichen
      constraint = constraint.replace(/\*/g, '');
      // Entferne Leerzeichen zwischen Zahlen und Variablen
      constraint = constraint.replace(/(\d)\s*([a-zA-Z])/g, '$1$2');
      // Entferne doppelte Leerzeichen
      constraint = constraint.replace(/\s+/g, ' ').trim();
      problemStr += ' c' + (index + 1) + ': ' + constraint + '\n';
    }

    // Bounds
    problemStr += 'Bounds\n';
    // Anpassung der Schleife: Verwenden von 'for-of'
    for (const variable of this.variables) {
      const varName = variable.trim();
      if (varName) {
        problemStr += ' ' + varName + ' >= 0\n';
      }
    }

    // End
    problemStr += 'End\n';

    this.problemInput = problemStr;
  }

  async solveProblem(): Promise<void> {
    this.errorMessage = ''
    this.solution = '';
    this.result = null;
    this.xWert = undefined;
    this.yWert = undefined;

    if (!this.objectiveFunction || this.constraints.length === 0) {
      this.errorMessage = this.translationService.getTranslation('enterObjectiveAndConstraint');

      return;
    }

    if (!this.numVariables || this.variables.some(v => !v.trim()) || !this.objectiveFunction || this.constraints.some(c => !c.trim())) {
      this.errorMessage = this.translationService.getTranslation('allfields');
      return;
    }

    if (this.variables.length === 0) {
      this.variables.push('');
    }

    if (this.constraints.length === 0) {
      this.constraints.push('');
    }

    // Erstelle die Problemdefinition basierend auf den Benutzereingaben
    this.buildProblemInput();

    // Hier können Sie die Problemdefinition prüfen
    console.log('Erstellte Problemdefinition:', this.problemInput);

    // Initialisiere den HiGHS Solver und passe locateFile an
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}`
    };

    const preparationStartTime = performance.now();
    const preparationEndTime = performance.now();
    this.preparationTime = preparationEndTime - preparationStartTime;

    const startTime = performance.now();

    try {
      // HiGHS-Solver mit den definierten Einstellungen laden
      const highsSolver = await highs(highs_settings);
      console.log("HiGHS initialisiert");
      let highsResult: HighsSolution;

      // Lösen des vom Benutzer eingegebenen Problems
      let constraints;
      try {
        console.log("Probleminput:", this.problemInput);
        highsResult = await highsSolver.solve(this.problemInput);
        constraints = this.extractConstraints(this.problemInput);
        console.log("Problem gelöst");
      } catch (error) {
        console.log('Fehler beim Lösen des Problems:', error, "\nMit umgeformtem Input");
        const LP = this.umformungService.umformen(this.problemInput);
        highsResult = await highsSolver.solve(LP);
        constraints = this.extractConstraints(LP);
      }

      // Konvertiere das HiGHS-Ergebnis in dein Result-Format
      this.result = this.convertToResult(highsResult);
      console.log("Ergebnis in Result konvertieren");

      // Füge die Constraints in den ConstraintsService hinzu
      this.constraintsService.setConstraints(constraints);
      this.constraintsService.constraintsUpdated.next();

      // Ergebnis als JSON speichern und anzeigen
      this.solution = JSON.stringify(this.result, null, 2);

      // Laufzeitanalyse
      const endTime = performance.now();
      this.elapsedTime = endTime - startTime;

      // Werte für x und y ermitteln
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

    let isObjective = true;
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Maximize') || trimmedLine.startsWith('Minimize')) {
        isObjective = false;
        continue;
      }
      if (isObjective) {
        continue;
      }
      if (trimmedLine.startsWith('Subject To')) {
        continue;
      }
      if (trimmedLine.startsWith('Bounds')) {
        break;
      }

      const parts = trimmedLine.split(/<=|>=|=/);
      if (parts.length < 2) {
        continue;
      }

      const lhs = this.normalizeVariableNames(parts[0].trim());
      const rhs = parts[1].trim();
      const relation = trimmedLine.includes('<=') ? '<=' : trimmedLine.includes('>=') ? '>=' : '=';
      constraints.push({
        name: `Constraint ${constraints.length + 1}`,
        terms: this.parseTerms(lhs),
        relation: relation,
        rhs: parseFloat(rhs),
      });
    }

    return constraints;
  }

  private normalizeVariableNames(expression: string): string {
    return expression.replace(/\s+(\d+)/g, '$1');
  }

  // Angepasste Methode zum Parsen der Terme einer Constraint
  private parseTerms(lhs: string): { name: string; coef: number }[] {
    const terms: { name: string; coef: number }[] = [];
    const termRegex = /([-+]?\d*\.?\d*)([a-zA-Z]\w*)/g;
    let match: RegExpExecArray | null;

    while ((match = termRegex.exec(lhs)) !== null) {
      const coef = match[1] ? parseFloat(match[1]) : 1;
      const variable = match[2];
      terms.push({ name: variable, coef: coef });
    }

    return terms;
  }

  // === EXPORT FUNCTIONALITY ===

  downloadLP() {
    if (!this.problemInput) {
      this.buildProblemInput();
    }
    const lpData = this.problemInput;
    this.downloadFile(lpData, 'model.lp', 'text/plain');
  }

  downloadMPS() {
    if (!this.problemInput) {
      this.buildProblemInput();
    }
    const mpsData = this.problemInput;
    this.downloadFile(mpsData, 'model.mps', 'text/plain');
  }

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
