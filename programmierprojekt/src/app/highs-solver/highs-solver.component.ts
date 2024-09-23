import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import highs from 'highs';

@Component({
  selector: 'app-highs-solver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './highs-solver.component.html',
  styleUrl: './highs-solver.component.css'
})
export class HighsSolverComponent {
  problemInput= '';  // Eingabefeld für das Problem, standardmäßig leer
  solution = '';  // Variable zur Anzeige der Lösung


  // Methode zur Lösung des Benutzerproblems
  async solveProblem(): Promise<void> {
    // Initialisiere den HiGHS Solver und passe locateFile an
    const highs_settings = {
      locateFile: (file: string) => `highs/${file}`  // Zeigt auf den Ordner, wo die WASM-Datei liegt
    };

    try {
      // HiGHS-Solver mit den definierten Einstellungen laden
      const highsSolver = await highs(highs_settings);

      // Lösen des vom Benutzer eingegebenen Problems
      const result = highsSolver.solve(this.problemInput);

      // Ergebnis als JSON speichern und anzeigen
      this.solution = JSON.stringify(result, null, 2);
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Lösen des Problems:', error);
      this.solution = 'Fehler beim Lösen des Problems: ' + error;
    }
  }
}
