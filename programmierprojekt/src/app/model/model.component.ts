import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

@Component({
  selector: 'app-model',
  standalone: true,
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent implements OnInit {
  constraints!: any[];
  chart: any;

  constructor(private constraintsService: ConstraintsService) {}

  ngOnInit() {
    Chart.register(LineController, LinearScale, Title, PointElement, LineElement, Filler);
    this.constraintsService.constraintsUpdated.subscribe(() => this.onSolve());
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
  
      
      for (let x1 = 0; x1 <= 10; x1 += 0.1) {
          const values = { x1 };
          const lhs = equation(values); // Linke Seite der Gleichung

          if (constraint.terms.length === 1 && constraint.terms[0].name === 'x1' && constraint.relation === '<=') {
            const x1 = constraint.rhs; // x1 ist 4
            // Erstelle eine vertikale Linie bei x1 = 4 und variiere x2 von 0 bis einem Maximalwert
            for (let x2 = 0; x2 <= 10; x2 += 0.1) {
                constraintData.push({ x: x1, y: x2 });
            }
        }
          else {
            if (constraint.relation === '<=') {
              const x2 = (constraint.rhs - lhs) / (constraint.terms.find((term: { name: string; coef: number }) => term.name === 'x2')?.coef || 1);
              if (x2 >= 0) {
                  constraintData.push({ x: x1, y: x2 });
              }
          } else if (constraint.relation === '>=') {
              const x2 = (lhs - constraint.rhs) / (constraint.terms.find((term: { name: string; coef: number }) => term.name === 'x2')?.coef || 1);
              if (x2 >= 0) {
                  constraintData.push({ x: x1, y: x2 });
              }
          } else if (constraint.relation === '=') {
              const x2 = (constraint.rhs - lhs) / (constraint.terms.find((term: { name: string; coef: number }) => term.name === 'x2')?.coef || 1);
              if (x2 >= 0) {
                  constraintData.push({ x: x1, y: x2 });
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

}
