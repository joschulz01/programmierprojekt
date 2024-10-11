import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatenschutzComponent } from './datenschutz.component';
import { TranslationService } from '../../translationservice';

describe('DatenschutzComponent', () => {
  let component: DatenschutzComponent;
  let fixture: ComponentFixture<DatenschutzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatenschutzComponent],
      providers: [TranslationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatenschutzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Testet, ob die Komponente erfolgreich erstellt wurde
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Testet, ob die Übersetzungen für den Titel der Datenschutzrichtlinie korrekt abgerufen werden
  it('should get the privacy policy title from translation service', () => {
    const title = component.translationService.getTranslation('privacyPolicyTitle');
    expect(title).toBeDefined(); // Überprüft, dass der Titel definiert ist
  });

  // Testet, ob die Daten der verantwortlichen Person korrekt abgerufen werden
  it('should get the responsible person description from translation service', () => {
    const description = component.translationService.getTranslation('responsiblePersonDescription');
    expect(description).toBeDefined(); // Überprüft, dass die Beschreibung definiert ist
  });

  // Testet, ob der Wechsel der Sprache funktioniert
  it('should switch language', () => {
    const initialLanguage = component.translationService.getCurrentLanguage();
    component.switchLanguage();
    expect(component.translationService.getCurrentLanguage()).not.toBe(initialLanguage);
  });

  // Testet, ob die Anschrift korrekt angezeigt wird
  it('should display institution address correctly', () => {
    const address = fixture.nativeElement.querySelector('address');
    expect(address).toBeTruthy();
    expect(address.textContent).toContain('hs-osnabrueck.de');
  });
});
