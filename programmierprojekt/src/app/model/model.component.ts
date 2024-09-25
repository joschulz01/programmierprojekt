import { Component, input, OnInit } from '@angular/core';
import { Chart, LinearScale, Title, PointElement, LineElement, Filler, LineController } from 'chart.js';
import { ConstraintsService } from '../constraints.service';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})



export class ModelComponent implements OnInit{

  constraints!: any[];

  constructor(private constraintsService: ConstraintsService) {}
  chart: any;

  ngOnInit() {
    this.constraints = this.constraintsService.getConstraints();
    // Registriere die Controller, Skalen und Elemente
    Chart.register(LineController, LinearScale, Title, PointElement, LineElement, Filler);
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    // Definiere die Nebenbedingungen
    
    
    this.constraints.forEach(constraint => {
      console.log(`Constraint Name: ${constraint.name}`);
      constraint.terms.forEach((term: { name: string; coef: number })=> {
        console.log(`Variable: ${term.name}, Coefficient: ${term.coef}`);
      });
    });
    // Erstelle ein Dataset für jede Nebenbedingung
    const datasets = this.constraints.map(constraint => {
      const constraintData = [];
      for (let x = 0; x <= 15; x += 0.5) {
        const y = constraint.equation(x);
        constraintData.push({ x, y });
      }
      return {
        label: constraint.name,
        data: constraintData,
        borderColor: 'rgba(255, 99, 132, 1)', // Eine einheitliche Farbe für alle Linien
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        pointRadius: 0 // Keine Punkte auf dieser Linie
      };
    });

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          
          ...datasets // Füge die generierten Datasets hinzu
        ]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0, // Minimale X-Wert
            max: 15  // Maximale X-Wert
          },
          y: {
            beginAtZero: true,
            min: 0, // Minimale Y-Wert
            max: 10 // Maximale Y-Wert
          }
        }
      }
    });
  }
}
