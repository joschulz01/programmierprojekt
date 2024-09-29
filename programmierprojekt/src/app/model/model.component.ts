import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

@Component({
  selector: 'app-model',
  standalone: true,
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent {
  constraints!: any[];
  chart: any;

  constructor(private constraintsService: ConstraintsService) {}

  ngOnInit() {
    Chart.register(LineController, LinearScale, Title, PointElement, LineElement, Filler);
    
    // Abonnieren der constraintsUpdated-Benachrichtigung
    this.constraintsService.constraintsUpdated.subscribe(() => this.onSolve());
    
    // Sofortige Aktualisierung des Charts
    this.onSolve(); // Aufruf hier, um sofort zu aktualisieren
}

  onSolve() {
    this.constraints = this.constraintsService.getConstraints();
    console.log('Constraints:', this.constraints);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (!ctx) {
        console.error('Canvas element with id "myChart" not found.');
        return;
    }

    if (this.chart) {
        this.chart.destroy();
    }

    const datasets = this.constraints.map(constraint => {
      const equation = this.constraintsService.convertConstraintToEquation(constraint);
      const constraintData = [];
  
      // Dynamische Erkennung von Variablennamen
      const variableNames = this.getVariableNames(constraint);

      for (let xValue = 0; xValue <= 10; xValue += 0.1) {
          const values = { [variableNames[0]]: xValue }; // Erstes dynamisches Variable (z.B. x oder x1)
          const lhs = equation(values); // Linke Seite der Gleichung

          if (constraint.terms.length === 1 && constraint.terms[0].name === variableNames[0] && constraint.relation === '<=') {
            const x1 = constraint.rhs; // x1 ist ein Wert
            for (let yValue = 0; yValue <= 10; yValue += 0.1) {
                constraintData.push({ x: x1, y: yValue });
            }
          } else {
            const coefY = constraint.terms.find((term: { name: string; coef: number }) => term.name === variableNames[1])?.coef || 1;

            if (constraint.relation === '<=') {
              const yValue = (constraint.rhs - lhs) / coefY;
              if (yValue >= 0) {
                  constraintData.push({ x: xValue, y: yValue });
              }
            } else if (constraint.relation === '>=') {
              const yValue = (lhs - constraint.rhs) / coefY;
              if (yValue >= 0) {
                  constraintData.push({ x: xValue, y: yValue });
              }
            } else if (constraint.relation === '=') {
              const yValue = (constraint.rhs - lhs) / coefY;
              if (yValue >= 0) {
                  constraintData.push({ x: xValue, y: yValue });
              }
            }
          }
      }
  
      return {
          label: constraint.name,
          data: constraintData,
          borderColor: 'rgba(75, 192, 192, 1)', // Farbe für die Linie
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1,
          pointRadius: 0,
      };
  });

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 25,
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 25,
                }
            }
        }
    });
  }

  // Hilfsmethode zur Erkennung der Variablennamen aus den Constraints
  getVariableNames(constraint: any): string[] {
    const variableNames = new Set<string>();

    // Iteriere durch die terms im Constraint und füge die Variablennamen hinzu
    constraint.terms.forEach((term: { name: string }) => {
      variableNames.add(term.name);
    });

    console.log(variableNames);
    return Array.from(variableNames); // Rückgabe von z.B. ['x', 'y'] oder ['x1', 'x2']
  }

}
