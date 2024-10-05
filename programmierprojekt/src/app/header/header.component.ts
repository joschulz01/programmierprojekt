import { Component } from '@angular/core';
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  // Ändere hier die Sichtbarkeit
  constructor(public translationService: TranslationService) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
