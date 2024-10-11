import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(public translationService: TranslationService) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
