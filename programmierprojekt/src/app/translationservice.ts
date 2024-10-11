import { Injectable } from '@angular/core';
import { DE_TRANSLATIONS } from './language/language-de';
import { EN_TRANSLATIONS } from './language/language-en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  currentLanguage = 'de';
  translations: Record<string, string> = DE_TRANSLATIONS;

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

  getTranslation(key: string): string {
    return this.translations[key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}
