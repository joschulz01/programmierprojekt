import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Constraint {
  name: string;
  terms: { name: string; coef: number }[];
  relation: string;
  rhs: number;
}

@Injectable({
  providedIn: 'root',
})

export class ConstraintsService {
  private constraints: Constraint[] = [];
  constraintsUpdated: Subject<void> = new Subject<void>();

  setConstraints(newConstraints: Constraint[]): void {
    this.constraints = newConstraints;
    this.constraintsUpdated.next();
  }

  getConstraints(): Constraint[] {
    return this.constraints;
  }

  convertConstraintToEquation(constraint: Constraint): (values: Record<string, number>) => number {
    return (values: Record<string, number>) => {
        return constraint.terms.reduce((acc: number, term: { name: string; coef: number }) => {
            const variableValue = values[term.name] || 0; 
            return acc + term.coef * variableValue; 
        }, 0);
    };
}

}
