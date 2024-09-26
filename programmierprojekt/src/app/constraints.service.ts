import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConstraintsService {
  private constraints: any[] = [];  // Internes Array zur Speicherung der Constraints
  constraintsUpdated: Subject<void> = new Subject<void>(); // Subject für Benachrichtigungen

  constructor() {}

  // Methode zum Setzen der Constraints
  setConstraints(newConstraints: any[]): void {
    this.constraints = newConstraints;
    this.constraintsUpdated.next(); // Benachrichtige die Abonnenten über die Änderungen
  }

  // Methode zum Abrufen der Constraints
  getConstraints(): any[] {
    return this.constraints;
  }

  // Methode zur Konvertierung einer Constraint in eine Gleichung
  convertConstraintToEquation(constraint: any): (values: { [key: string]: number }) => number {
    return (values: { [key: string]: number }) => {
        // Wir berechnen die Gleichung unter Verwendung der Variablenwerte aus dem "values" Objekt
        return constraint.terms.reduce((acc: number, term: { name: string; coef: number }) => {
            const variableValue = values[term.name] || 0; // Hole den Wert der Variablen
            return acc + term.coef * variableValue; 
        }, 0);
    };
}

}
