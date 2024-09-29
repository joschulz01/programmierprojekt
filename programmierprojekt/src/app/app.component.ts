import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from "./header/header.component";
import { HighsSolverComponent} from "./highs-solver/highs-solver.component";
import { MenuComponent } from "./menu/menu.component";
import { RouterOutlet } from '@angular/router';
import { FeedbackComponent } from './<feedback>/<feedback>.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    HighsSolverComponent,
    MenuComponent,
    FeedbackComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'programmierprojekt';
}
