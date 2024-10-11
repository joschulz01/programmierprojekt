import { Component, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { TranslationService } from '../../translationservice';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnChanges {
  constructor(
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef // Fügen Sie ChangeDetectorRef hinzu
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Überprüfen, ob sich Übersetzungen geändert haben
    if (changes['translationService']) {
      this.cdr.detectChanges(); // Änderungen manuell prüfen
    }
  }

  switchLanguage() {
    this.translationService.switchLanguage();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }
}
