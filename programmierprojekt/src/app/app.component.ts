import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HeaderComponent } from "./header/header.component";
import { HighssolverComponent} from "./highssolver/highssolver.component";
import { MenuComponent } from "./menu/menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    HighssolverComponent,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'programmierprojekt';
}
