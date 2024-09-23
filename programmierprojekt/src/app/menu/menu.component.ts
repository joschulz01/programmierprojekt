import { Component } from '@angular/core';
import { MENU_ITEMS } from "../menu-items";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  Menu1 = MENU_ITEMS[0]
  Menu2 = MENU_ITEMS[1]
  Menu3 = MENU_ITEMS[2]
  Menu4 = MENU_ITEMS[3]
}
