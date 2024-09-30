import { Component, Input } from '@angular/core';
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

@Component({
  selector: 'app-model',
  standalone: true,
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
export class ModelComponent {
    @Input() xWert?: number;  // Input Property für X-Wert
    @Input() yWert?: number;  // Input Property für Y-Wert
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
        const constraintData: { x: number; y: number }[] = []; // Typ festlegen
        const variableNames = this.getVariableNames(constraint);

        for (let xValue = 0; xValue <= 10; xValue += 0.1) {
            const values = { [variableNames[0]]: xValue };
            const lhs = equation(values);

            if (constraint.terms.length === 1 && constraint.terms[0].name === variableNames[0] && constraint.relation === '<=') {
                const x1 = constraint.rhs;
                for (let yValue = 0; yValue <= 10; yValue += 0.1) {
                    constraintData.push({ x: x1, y: yValue });
                }
            } else {
                const coefY = constraint.terms.find((term: { name: string; coef: number }) => term.name === variableNames[1])?.coef || 1;

                let yValue: number; // yValue als number deklarieren

                if (constraint.relation === '<=') {
                    yValue = (constraint.rhs - lhs) / coefY;
                    if (yValue >= 0) {
                        constraintData.push({ x: xValue, y: yValue });
                    }
                } else if (constraint.relation === '>=') {
                    yValue = (lhs - constraint.rhs) / coefY;
                    if (yValue >= 0) {
                        constraintData.push({ x: xValue, y: yValue });
                    }
                } else if (constraint.relation === '=') {
                    yValue = (constraint.rhs - lhs) / coefY;
                    if (yValue >= 0) {
                        constraintData.push({ x: xValue, y: yValue });
                    }
                }
            }
        }

        return {
            label: constraint.name,
            data: constraintData,
            borderColor: 'rgba(75, 192, 192, 1)', 
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
        };
    });

    // Dynamisch Min/Max für die Achsen berechnen
    const xValues = datasets.flatMap(dataset => dataset.data.map(point => point.x));
    const yValues = datasets.flatMap(dataset => dataset.data.map(point => point.y));

    const xMin = Math.min(0, Math.min(...xValues));
    const xMax = Math.max(10, Math.max(...xValues));
    const yMin = Math.min(0, Math.min(...yValues));
    const yMax = Math.max(10, Math.max(...yValues));
    

    this.chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Maximal/Minimal Punkt',
                    data: [
                        { x: this.xWert , y: this.yWert }, // Setze Default-Werte
                    ],
                    borderColor: 'rgba(255, 0, 0, 1)',
                    fill: false,
                    pointRadius: 5, // Erhöhe die Punktgröße, um Sichtbarkeit zu erhöhen
                },
                ...datasets // Füge die vorhandenen Datensätze hier hinzu
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: xMin,
                    max: xMax,
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    beginAtZero: true,
                    min: yMin,
                    max: yMax,
                    ticks: {
                        stepSize: 1
                    }
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
