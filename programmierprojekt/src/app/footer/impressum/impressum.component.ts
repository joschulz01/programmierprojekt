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


  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
