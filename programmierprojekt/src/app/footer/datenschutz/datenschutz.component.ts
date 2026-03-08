import { Component, inject } from '@angular/core';
import { TranslationService } from '../../translationservice';

@Component({
    selector: 'app-datenschutz',
    imports: [],
    templateUrl: './datenschutz.component.html',
    styleUrl: './datenschutz.component.css'
})
export class DatenschutzComponent {
  translationService = inject(TranslationService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
