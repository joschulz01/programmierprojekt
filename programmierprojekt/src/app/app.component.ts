import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from "./header/header.component";
import { MenuComponent } from "./menu/menu.component";

@Component({
    selector: 'app-root',
    imports: [
    FooterComponent,
    FormsModule,
    RouterOutlet,
    HeaderComponent,
    MenuComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'programmierprojekt';
}
