import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import highs, { HighsSolution } from 'highs'; 
import { ConstraintsService } from '../constraints.service';
import { UmformungService } from '../umformung.service';
import { ModelComponent } from '../model/model.component';
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-highs-solver',
  standalone: true,
  imports: [CommonModule, FormsModule, ModelComponent],
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})
export class ParameterComponent {

  errorMessage: string | null = null;  // Fehlernachricht
  numVariables: number = 0;
  variables: string[] = [];
  objectiveFunction: string = '';
  constraints: string[] = [];

  switchLanguage() {
    this.translationService.switchLanguage();
  }

  generateVariableInputs() {
    this.variables = new Array(this.numVariables).fill('');
  }

  addConstraint() {
    this.constraints.push(''); // Leeres Feld für die neue Nebenbedingung
  }

  xWert?: number;
  yWert?: number;

  constructor(private constraintsService: ConstraintsService, private umformungService: UmformungService, public translationService: TranslationService) {}

  async solveProblem(): Promise<void> {
    if (!this.objectiveFunction || this.constraints.length === 0) {
        this.errorMessage = 'Bitte geben Sie eine Zielfunktion und mindestens eine Nebenbedingung ein.';
        return;
    }

}
}
