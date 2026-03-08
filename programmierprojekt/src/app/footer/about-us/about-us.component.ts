import { Component, inject } from '@angular/core';
import { TranslationService } from '../../translationservice';

@Component({
    selector: 'app-about-us',
    imports: [],
    templateUrl: './about-us.component.html',
    styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  translationService = inject(TranslationService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
      }
