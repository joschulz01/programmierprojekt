import { Component, inject } from '@angular/core';
import { TranslationService } from '../translationservice';

@Component({
    selector: 'app-feedback',
    imports: [],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  translationService = inject(TranslationService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  switchLanguage() {
    this.translationService.switchLanguage();
  }

}
