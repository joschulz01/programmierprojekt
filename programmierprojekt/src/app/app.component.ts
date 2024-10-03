import { AboutUsComponent } from './about-us/about-us.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from "./header/header.component";
import { HighsSolverComponent} from "./highs-solver/highs-solver.component";
import { HomeComponent } from './home/home.component';
import { MenuComponent } from "./menu/menu.component";
import { RouterOutlet } from '@angular/router';
import { ModelComponent } from './model/model.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AboutUsComponent,
    CommonModule,
    FeedbackComponent,
    FooterComponent,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    HighsSolverComponent,
    HomeComponent,
    MenuComponent,
    ModelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'programmierprojekt';
}
