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

  switchLanguage() {
    this.translationService.switchLanguage();
  }

}
