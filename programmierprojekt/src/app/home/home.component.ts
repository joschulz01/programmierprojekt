import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../translationservice';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

  export class HomeComponent implements OnInit, OnDestroy {
    public currentSlide = 0;
    private slideInterval: number | undefined;
  
    public values = [
      {
        title: "Intuitive Benutzeroberfläche",
        description: "Ein einfaches Design ermöglicht Ihnen einen schnellen Einstieg, ohne dass Sie viel Zeit mit dem Lernen verbringen müssen."
      },
      {
        title: "Optimale Effizienz",
        description: "Setzen Sie leistungsstarke Algorithmen ein, um Ihre Projekte effizient zu gestalten und Ergebnisse zu maximieren."
      },
      {
        title: "Praxiserfahrung",
        description: "Übertragen Sie Ihr theoretisches Wissen in echte Anwendungen und entwickeln Sie Fähigkeiten, die Ihnen im Berufsleben helfen."
      }
    ];  

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.values.length;
    }, 5000); // Wechsel alle 5 Sekunden
  }

  // Diese Methode wechselt manuell zum gewünschten Slide
  goToSlide(index: number): void {
    this.currentSlide = index;
    clearInterval(this.slideInterval); // Reset the interval after manual change
    this.startSlideShow(); // Restart the interval
  }

  switchLanguage() {
    this.translationService.switchLanguage();
  }
}