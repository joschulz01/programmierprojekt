import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatenschutzComponent } from './datenschutz.component';
import { TranslationService } from '../../translationservice';

describe('DatenschutzComponent', () => {
  let component: DatenschutzComponent;
  let fixture: ComponentFixture<DatenschutzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatenschutzComponent], 
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

  // Test für Datenschutzbeauftragten-Daten
  it('should display the correct data protection officer information', () => {
    const dataProtectionInfo = component.translationService.getTranslation('dataProtectionOfficerDescription');
    expect(dataProtectionInfo).toBeDefined();
    const address = fixture.nativeElement.querySelector('.data-protection-officer address');
    expect(address.textContent).toContain('datenschutz@hs-osnabrueck.de');
  });

  // Test für interne Links
  it('should display correct phone and email links', () => {
    const phoneLink = fixture.nativeElement.querySelector('a[href^="tel:"]');
    expect(phoneLink).toBeTruthy();
    expect(phoneLink.getAttribute('href')).toContain('tel:+495419690');

    const emailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]');
    expect(emailLink).toBeTruthy();
    expect(emailLink.getAttribute('href')).toContain('mailto:webmaster@hs-osnabrueck.de');
  });

  // Test für dynamischen Sprachwechsel
  it('should update content when language is switched', () => {
    spyOn(component.translationService, 'getTranslation').and.callFake((key: string) => {
      if (key === 'privacyPolicyTitle') return 'Privacy Policy';
      return key;
    });

    fixture.detectChanges();
    let title = fixture.nativeElement.querySelector('h1').textContent;
    expect(title).toBe('Privacy Policy');

    component.switchLanguage();
    spyOn(component.translationService, 'getTranslation').and.callFake((key: string) => {
      if (key === 'privacyPolicyTitle') return 'Datenschutzrichtlinie';
      return key;
    });

    fixture.detectChanges();
    title = fixture.nativeElement.querySelector('h1').textContent;
    expect(title).toBe('Datenschutzrichtlinie');
  });

  // Test für CSS-Klassen
  it('should apply correct CSS classes to elements', () => {
    const privacyContainer = fixture.nativeElement.querySelector('.privacy-container');
    expect(privacyContainer).toBeTruthy();
    expect(window.getComputedStyle(privacyContainer).maxWidth).toBe('800px');

    const h1Element = fixture.nativeElement.querySelector('h1');
    expect(h1Element).toBeTruthy();
    expect(window.getComputedStyle(h1Element).textAlign).toBe('center');
  });

  // Test für Aufsichtsbehörden-Daten
  it('should display the supervisory authority description', () => {
    const supervisoryAuthorityDescription = component.translationService.getTranslation('supervisoryAuthorityDescription');
    expect(supervisoryAuthorityDescription).toBeDefined();
    const supervisoryText = fixture.nativeElement.querySelector('.responsible-info p:last-of-type').textContent;
    expect(supervisoryText).toContain(supervisoryAuthorityDescription);
  });

  // Mock-Test für TranslationService-Aufrufe
  it('should call getTranslation method for all relevant keys', () => {
    const spy = spyOn(component.translationService, 'getTranslation').and.callThrough();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('privacyPolicyTitle');
    expect(spy).toHaveBeenCalledWith('responsiblePersonTitle');
    expect(spy).toHaveBeenCalledWith('institutionName');
  });