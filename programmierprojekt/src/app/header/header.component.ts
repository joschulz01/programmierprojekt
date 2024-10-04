import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'

import { TranslationService } from '../translationservice';  // Dein Pfad

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public translationService: TranslationService) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
