import { Component } from '@angular/core';
import { DE_TRANSLATIONS } from './language-de';
import { EN_TRANSLATIONS } from './language-en';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent {
  translations = DE_TRANSLATIONS; // Standardmäßig auf Deutsch
  currentLanguage = 'de';

  switchLanguage() {
    if (this.currentLanguage === 'de') {
      this.translations = EN_TRANSLATIONS;
      this.currentLanguage = 'en';
    } else {
      this.translations = DE_TRANSLATIONS;
      this.currentLanguage = 'de';
    }
  }
}

