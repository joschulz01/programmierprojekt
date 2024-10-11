import { Component, Input, OnInit } from '@angular/core'; 
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController, ChartDataset } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

interface Constraint {
  name: string; 
  terms: { name: string; coef: number }[]; 
  relation: string; 
  rhs: number; 
}

interface ChartDataPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-model',
  standalone: true,
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css'],
})
<<<<<<< Updated upstream
export class ModelComponent implements OnInit { // Implementiere OnInit
  @Input() xWert?: number;  // Input Property f�r X-Wert
  @Input() yWert?: number;  // Input Property f�r Y-Wert
  constraints!: Constraint[];
  chart!: Chart; // Typ f�r das Chart hinzuf�gen
=======
export class ModelComponent implements OnInit { 
  @Input() xWert?: number;  
  @Input() yWert?: number;  
  constraints!: Constraint[];
  chart!: Chart; 
>>>>>>> Stashed changes

  constructor(private constraintsService: ConstraintsService) {}

  ngOnInit() {
    Chart.register(LineController, LinearScale, Title, PointElement, LineElement, Filler);
<<<<<<< Updated upstream

    // Abonnieren der constraintsUpdated-Benachrichtigung
    this.constraintsService.constraintsUpdated.subscribe(() => this.onSolve());

    // Sofortige Aktualisierung des Charts
    this.onSolve(); // Aufruf hier, um sofort zu aktualisieren
  }

  // Methode zur �berpr�fung der Anzahl der �bergebenen Input-Variablen
=======
    this.constraintsService.constraintsUpdated.subscribe(() => this.onSolve());
    this.onSolve();
  }

>>>>>>> Stashed changes
  checkInputCount(): boolean {
    const inputs = [this.xWert, this.yWert];
    const definedInputs = inputs.filter(input => input !== undefined);

    if (definedInputs.length > 2) {
      console.error('Mehr als 2 Eingabewerte �bergeben.');
<<<<<<< Updated upstream
      return false; // Mehr als 2 Variablen, also nicht ausf�hren
    }

    return true; // Weniger oder genau 2 Variablen, also ausf�hren
  }

  onSolve() {
    // �berpr�fe die Anzahl der Input-Variablen
    if (!this.checkInputCount()) {
      return; // Falls mehr als 2 Eingabewerte �bergeben wurden, Abbruch
=======
      return false; 
    }
    return true;
  }

  onSolve() {
    if (!this.checkInputCount()) {
      return; 
>>>>>>> Stashed changes
    }

    this.constraints = this.constraintsService.getConstraints();

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element with id "myChart" not found.');
      return;
    }

    if (this.chart) {
<<<<<<< Updated upstream
      this.chart.destroy(); // Das vorhandene Chart wird zerst�rt
=======
      this.chart.destroy();
>>>>>>> Stashed changes
    }

    const datasets: ChartDataset<'line'>[] = this.constraints.map(constraint => {
      const equation = this.constraintsService.convertConstraintToEquation(constraint);
      const constraintData: ChartDataPoint[] = [];
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
          const coefY = constraint.terms.find(term => term.name === variableNames[1])?.coef || 1;

          let yValue: number;

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

<<<<<<< Updated upstream
    // Dynamisch Min/Max f�r die Achsen berechnen
    const xValues = datasets.flatMap(dataset =>
      dataset.data.map(point => {
        if (point) { // �berpr�fen, ob point nicht null ist
          return (point as ChartDataPoint).x; // Typassertion verwenden
=======
    const xValues = datasets.flatMap(dataset => 
      dataset.data.map(point => {
        if (point) { 
          return (point as ChartDataPoint).x; 
>>>>>>> Stashed changes
        }
        return 0;
      })
    );

    const yValues = datasets.flatMap(dataset =>
      dataset.data.map(point => {
<<<<<<< Updated upstream
        if (point) { // �berpr�fen, ob point nicht null ist
          return (point as ChartDataPoint).y; // Typassertion verwenden
=======
        if (point) { 
          return (point as ChartDataPoint).y; 
>>>>>>> Stashed changes
        }
        return 0;
      })
    );

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
            data: this.xWert !== undefined && this.yWert !== undefined
              ? [{ x: this.xWert, y: this.yWert }]
              : [],
            borderColor: 'rgba(255, 0, 0, 1)',
            fill: false,
<<<<<<< Updated upstream
            pointRadius: 7.5, // Erh�he die Punktgr��e f�r bessere Sichtbarkeit
          },
          ...datasets // Hier kommen die Constraints-Datens�tze hinzu
=======
            pointRadius: 7.5, 
          },
          ...datasets
>>>>>>> Stashed changes
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            suggestedMin: xMin, 
            suggestedMax: xMax,
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
  getVariableNames(constraint: Constraint): string[] {
    const variableNames = new Set<string>();
<<<<<<< Updated upstream

    // Iteriere durch die terms im Constraint und f�ge die Variablennamen hinzu
    constraint.terms.forEach(term => {
      variableNames.add(term.name);
    });

    return Array.from(variableNames); // R�ckgabe von z.B. ['x', 'y'] oder ['x1', 'x2']
=======
    constraint.terms.forEach(term => {
      variableNames.add(term.name);
    });
    return Array.from(variableNames); 
>>>>>>> Stashed changes
  }
}
