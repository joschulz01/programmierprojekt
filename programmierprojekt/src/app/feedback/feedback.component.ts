import { Component } from '@angular/core';
import { TranslationService } from '../translationservice';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  feedback: string = '';
  constructor(public translationService: TranslationService) {}
  switchLanguage() {
    this.translationService.switchLanguage();
  }

  onSubmit() {
    // Feedbacks im Local Storage speichern
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    feedbacks.push(this.feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    // JSON-Datei erstellen und herunterladen
    const blob = new Blob([JSON.stringify(feedbacks)], { type: 'application/json' });
    saveAs(blob, 'feedbacks.json');

    // Optional: Feedback-Feld leeren
    this.feedback = '';
  }
}