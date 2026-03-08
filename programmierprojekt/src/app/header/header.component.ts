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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
