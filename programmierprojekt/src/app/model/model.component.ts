import { Component, Input, OnInit } from '@angular/core'; // OnInit importieren
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController, ChartDataset } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

interface Constraint {
  name: string; // Name des Constraints (wird z.B. als Label in den Chart-Datasets verwendet)
  terms: { name: string; coef: number }[]; // Array von Terme mit Variablenname und Koeffizienten
  relation: string; // Relation des Constraints (z.B. '<=', '>=', '=')
  rhs: number; // Rechte Seite des Constraints (Wert, mit dem verglichen wird)
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
export class ModelComponent implements OnInit { // Implementiere OnInit
  @Input() xWert?: number;  // Input Property f�r X-Wert
  @Input() yWert?: number;  // Input Property f�r Y-Wert
  constraints!: Constraint[];
  chart!: Chart; // Typ f�r das Chart hinzuf�gen

  constructor(private constraintsService: ConstraintsService) {}

  ngOnInit() {
    Chart.register(LineController, LinearScale, Title, PointElement, LineElement, Filler);

    // Abonnieren der constraintsUpdated-Benachrichtigung
    this.constraintsService.constraintsUpdated.subscribe(() => this.onSolve());

    // Sofortige Aktualisierung des Charts
    this.onSolve(); // Aufruf hier, um sofort zu aktualisieren
  }

  // Methode zur �berpr�fung der Anzahl der �bergebenen Input-Variablen
  checkInputCount(): boolean {
    const inputs = [this.xWert, this.yWert];
    const definedInputs = inputs.filter(input => input !== undefined);

    if (definedInputs.length > 2) {
      console.error('Mehr als 2 Eingabewerte �bergeben.');
      return false; // Mehr als 2 Variablen, also nicht ausf�hren
    }

    return true; // Weniger oder genau 2 Variablen, also ausf�hren
  }

  onSolve() {
    // �berpr�fe die Anzahl der Input-Variablen
    if (!this.checkInputCount()) {
      return; // Falls mehr als 2 Eingabewerte �bergeben wurden, Abbruch
    }

    this.constraints = this.constraintsService.getConstraints();

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element with id "myChart" not found.');
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Das vorhandene Chart wird zerst�rt
    }

    const datasets: ChartDataset<'line'>[] = this.constraints.map(constraint => {
      const equation = this.constraintsService.convertConstraintToEquation(constraint);
      const constraintData: ChartDataPoint[] = []; // Typ festlegen
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

    // Dynamisch Min/Max f�r die Achsen berechnen
    const xValues = datasets.flatMap(dataset =>
      dataset.data.map(point => {
        if (point) { // �berpr�fen, ob point nicht null ist
          return (point as ChartDataPoint).x; // Typassertion verwenden
        }
        return 0; // Standardwert falls null
      })
    );

    const yValues = datasets.flatMap(dataset =>
      dataset.data.map(point => {
        if (point) { // �berpr�fen, ob point nicht null ist
          return (point as ChartDataPoint).y; // Typassertion verwenden
        }
        return 0; // Standardwert falls null
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
            pointRadius: 7.5, // Erh�he die Punktgr��e f�r bessere Sichtbarkeit
          },
          ...datasets // Hier kommen die Constraints-Datens�tze hinzu
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            suggestedMin: xMin, // Dynamisch berechnet auf Basis der Daten
            suggestedMax: xMax,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            beginAtZero: true,
            min: yMin, // Dynamisch berechnet auf Basis der Daten
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
  getVariableNames(constraint: Constraint): string[] {
    const variableNames = new Set<string>();

    // Iteriere durch die terms im Constraint und f�ge die Variablennamen hinzu
    constraint.terms.forEach(term => {
      variableNames.add(term.name);
    });

    return Array.from(variableNames); // R�ckgabe von z.B. ['x', 'y'] oder ['x1', 'x2']
  }
}
