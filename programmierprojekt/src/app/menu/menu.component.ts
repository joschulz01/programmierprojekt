import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'

import { MENU_ITEMS } from "../menu-items";
import { TranslationService } from '../translationservice';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  Menu1 = MENU_ITEMS[0]
  Menu2 = MENU_ITEMS[1]
  Menu3 = MENU_ITEMS[2]
  Menu4 = MENU_ITEMS[3]

  constructor(public translationService: TranslationService) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}
