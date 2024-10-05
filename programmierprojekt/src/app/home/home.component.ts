import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../translationservice';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl:'./home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  currentSlide = 0; // Start bei der ersten Folie
  interval: any;

  constructor(public translationService: TranslationService) {}

}