import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router'

import { MENU_ITEMS } from "../menu-items";
import { TranslationService } from '../translationservice';

@Component({
    selector: 'app-menu',
    imports: [RouterLink],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css'
})
export class MenuComponent {
  translationService = inject(TranslationService);

  Menu1 = MENU_ITEMS[0]
  Menu2 = MENU_ITEMS[1]
  Menu3 = MENU_ITEMS[2]
  Menu4 = MENU_ITEMS[3]

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
