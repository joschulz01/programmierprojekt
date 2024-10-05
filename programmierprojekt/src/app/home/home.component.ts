import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public translationService: TranslationService) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
  }