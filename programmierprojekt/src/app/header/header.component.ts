import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'
import { TranslationService } from '../translationservice';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  translationService = inject(TranslationService);

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
