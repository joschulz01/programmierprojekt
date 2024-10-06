import { Component } from '@angular/core';
import { TranslationService } from '../translationservice';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  constructor(public translationService: TranslationService) {}

   // Feedback senden Methode
   sendFeedback(form: any) {
    // Die E-Mail wird über EmailJS versendet
    emailjs.sendForm('service_s6fffxh', 'template_x0t1z6r', form, 'dIEg7YzpczbzzOa_N')
      .then((result: EmailJSResponseStatus) => {
        console.log(result.text);
        alert('Feedback erfolgreich gesendet!');
      }, (error) => {
        console.log(error.text);
        alert('Fehler beim Senden des Feedbacks.');
      });
  }

  switchLanguage() {
    this.translationService.switchLanguage();
  }

}
