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

  switchLanguage() {
    this.translationService.switchLanguage();
  }
      }
