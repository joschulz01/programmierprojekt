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

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
