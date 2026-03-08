import { Component, inject } from '@angular/core';
import { TranslationService } from '../../translationservice';

@Component({
    selector: 'app-impressum',
    imports: [],
    templateUrl: './impressum.component.html',
    styleUrl: './impressum.component.css'
})
export class ImpressumComponent {
  translationService = inject(TranslationService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
