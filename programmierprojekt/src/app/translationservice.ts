import { Injectable } from '@angular/core';
import { DE_TRANSLATIONS } from './language/language-de';  // Dein Pfad
import { EN_TRANSLATIONS } from './language/language-en';  // Dein Pfad

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  currentLanguage = 'de';  // Standardmäßig Deutsch
  translations = DE_TRANSLATIONS;

  switchLanguage() {
    if (this.currentLanguage === 'de') {
      this.translations = EN_TRANSLATIONS;
      this.currentLanguage = 'en';
    } else {
      this.translations = DE_TRANSLATIONS;
      this.currentLanguage = 'de';
    }
  }

  getTranslations() {
    return this.translations;
  }
}
