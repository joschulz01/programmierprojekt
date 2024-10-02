import { Component } from '@angular/core';
import { DE_TRANSLATIONS } from '../language/language-de'; // Pfad anpassen, wenn notwendig
import { EN_TRANSLATIONS } from '../language/language-en'; // Pfad anpassen, wenn notwendig

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  translations = DE_TRANSLATIONS;  // Standardmäßig Deutsch
  currentLanguage = 'de';

  switchLanguage(language: string) {
    if (language === 'de') {
      this.translations = DE_TRANSLATIONS;
      this.currentLanguage = 'de';
    } else if (language === 'en') {
      this.translations = EN_TRANSLATIONS;
      this.currentLanguage = 'en';
    }
  }
}
