import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Constraint {
  name: string; // Name des Constraints (wird z.B. als Label in den Chart-Datasets verwendet)
  terms: { name: string; coef: number }[]; // Array von Terme mit Variablenname und Koeffizient
  relation: string; // Relation des Constraints (z.B. '<=', '>=', '=')
  rhs: number; // Rechte Seite des Constraints (Wert, mit dem verglichen wird)
}

@Injectable({
  providedIn: 'root',
})

export class ConstraintsService {
  private constraints: Constraint[] = [];  // Internes Array zur Speicherung der Constraints
  constraintsUpdated: Subject<void> = new Subject<void>(); // Subject f�r Benachrichtigungen

  // Methode zum Setzen der Constraints
  setConstraints(newConstraints: Constraint[]): void {
    this.constraints = newConstraints;
    this.constraintsUpdated.next(); // Benachrichtige die Abonnenten �ber die �nderungen
  }

  // Methode zum Abrufen der Constraints
  getConstraints(): Constraint[] {
    return this.constraints;
  }

  // Methode zur Konvertierung einer Constraint in eine Gleichung
  convertConstraintToEquation(constraint: Constraint): (values: Record<string, number>) => number {
    return (values: Record<string, number>) => {
        return constraint.terms.reduce((acc: number, term: { name: string; coef: number }) => {
            const variableValue = values[term.name] || 0; 
            return acc + term.coef * variableValue; 
        }, 0);
    };
}

}
