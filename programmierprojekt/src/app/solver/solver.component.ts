import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as glpk from 'glpk.js';


interface Variable {
  name: string;
  type: number;
  lb: number;
  ub: number;
}

interface Constraint {
  name: string;
  coef: number[];
  sense: number;
  rhs: number;
}

@Component({
  selector: 'app-solver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css'],
})
export class SolverComponent {
  inputText= ''; // Textfeld für die Eingabe
  result: Record<string, number> | null = null;


  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.inputText = target.value; // Speichere den Input-Text
  }

  solve() {
    // Wir parsen die Eingabe hier
    const { variables, objective, constraints } = this.parseInput(this.inputText);
    
    const problem = {
      name: 'My Problem',
      objective: {
        direction: glpk.GLP_MAX,
        name: 'obj',
        coef: objective,
      },
      subjectTo: constraints,
      bounds: variables,
    };

    const solver = glpk.glp_create_prob();
    glpk.glp_set_obj_dir(solver, problem.objective.direction);
    glpk.glp_set_obj_name(solver, problem.objective.name);

    // Hinzufügen von Variablen
    problem.bounds.forEach((varData) => {
      const id = glpk.glp_add_cols(solver, 1);
      glpk.glp_set_col_name(solver, id, varData.name);
      glpk.glp_set_col_bnds(solver, id, varData.type, varData.lb, varData.ub);
    });

    // Hinzufügen von Einschränkungen
    problem.subjectTo.forEach((constraint) => {
      const id = glpk.glp_add_rows(solver, 1);
      glpk.glp_set_row_name(solver, id, constraint.name);
      glpk.glp_set_row_bnds(solver, id, constraint.sense, constraint.rhs, constraint.rhs);
    });

    // Setzen der Koeffizienten
    problem.subjectTo.forEach((constraint, rowIndex) => {
      const rowId = rowIndex + 1;
      for (let colIndex = 0; colIndex < problem.bounds.length; colIndex++) {
        const colId = colIndex + 1;
        glpk.glp_set_mat_row(solver, rowId, 1, [colId], [constraint.coef[colIndex]]);
      }
    });

    // Lösen des Problems
    //const lp = glpk.glp_simplex(solver, null);
    this.result = this.extractSolution(solver);
    glpk.glp_delete_prob(solver);
  }

  private parseInput(input: string) {
    const variables: Variable[] = [];
    const constraints: Constraint[] = [];
    let objective: number[] = [];
    const lines = input.split('\n');

    lines.forEach((line) => {
      line = line.trim();
      if (line.startsWith('var')) {
        const match = line.match(/var (\w+)\s*>=\s*0/);
        if (match) {
          variables.push({ name: match[1], type: glpk.GLP_LO, lb: 0, ub: Number.POSITIVE_INFINITY });
        }
      } else if (line.startsWith('maximize')) {
        const objectiveMatch = line.match(/maximize Objective:\s*(.*)/);
        if (objectiveMatch) {
          objective = objectiveMatch[1]
            .split('+')
            .map((term) => {
              const varName = term.trim();
              return variables.find((v) => v.name === varName) ? 1 : 0; // Setze Koeffizienten
            });
        }
      } else if (line.startsWith('s.t.')) {
        const constraintMatch = line.match(/s.t. (.*?):\s*(.*)/);
        if (constraintMatch) {
          const constraintName = constraintMatch[1];
          const constraintExpr = constraintMatch[2];
          const lhsTerms = constraintExpr.split('+').map((term) => {
            const [coef, varName] = term.trim().split(' ');
            return {
              name: varName,
              coef: Number(coef) || 1,
            };
          });

          constraints.push({
            name: constraintName,
            coef: lhsTerms.map((term) => term.coef),
            sense: glpk.GLP_LE,
            rhs: 15, // Hier müsstest du die RHS auch parsen
          });
        }
      }
    });

    return { variables, objective, constraints };
  }

  private extractSolution(solver: unknown) {
    const solution: Record<string, number> = {};
    for (let i = 1; i <= glpk.glp_get_num_cols(solver); i++) {
      const name = glpk.glp_get_col_name(solver, i);
      const value = glpk.glp_get_col_prim(solver, i);
      solution[name] = value;
    }
    return solution;
  }
}
