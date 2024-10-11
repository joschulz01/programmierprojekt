import { Component } from '@angular/core';
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  constructor(public translationService: TranslationService) {}
  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
