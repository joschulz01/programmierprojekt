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
      this.constraintsService.constraintsUpdated.next();

      this.solution = JSON.stringify(this.result, null, 2);

 const endTime = performance.now();
 this.elapsedTime = endTime - startTime;

      this.WerteErmitteln(this.result);
    } catch (error) {
      console.error('Fehler beim L�sen des Problems:', error);
      this.solution = 'Fehler beim L�sen des Problems: ' + error;
    }
  }

  private convertToResult(highsResult: HighsSolution): Result {
    const columns: Record<string, Column> = {};
    const rows: Row[] = [];

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

  private parseTerms(lhs: string): { name: string; coef: number }[] {
    const terms: { name: string; coef: number }[] = [];
    const termRegex = /([-+]?\d*\.?\d+)?\s*([xy]\d+)/g;
    let match: RegExpExecArray | null;

    while ((match = termRegex.exec(lhs)) !== null) {
      const coef = match[1] ? parseFloat(match[1]) : 1;
      const variable = match[2];
      terms.push({ name: variable, coef: coef });
    }

    return terms;
  }

  downloadLP() {
    const lpData = this.problemInput;
    this.downloadFile(lpData, 'model.lp', 'text/plain');
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
        this.problemInput = (e.target?.result as string) || '';
      };
      reader.readAsText(selectedFile);
    } else {
      alert('Keine Datei ausgewählt.');
    }
  };
  input.click();

}
isValidInput(): boolean {
  const Reihe = this.result?.Rows.length || 0;

  if (Reihe <= 2) {
    return true;
  } else {
    return false;
  }
}
}
