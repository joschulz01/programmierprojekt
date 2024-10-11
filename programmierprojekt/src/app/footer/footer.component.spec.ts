import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { Router } from '@angular/router'; 
import { TranslationService } from '../translationservice';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    // Mock TranslationService
    mockTranslationService = jasmine.createSpyObj('TranslationService', ['getTranslation']);

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [Router], // Zum Testen von RouterLink
      providers: [{ provide: TranslationService, useValue: mockTranslationService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Komponente wird korrekt erstellt
  it('should create', () => {
    expect(component).toBeTruthy(); // Überprüfen, ob die Komponente erfolgreich erstellt wurde
  });

  // Test 2: Übersetzter Text für Datenschutz anzeigen
  it('should display the translated text for Datenschutz', () => {
    // Setzen eines Mock-Werts für die Übersetzung
    mockTranslationService.getTranslation.and.returnValue('Datenschutz');
    fixture.detectChanges();

    // Überprüfen, ob der Text "Datenschutz" im Button enthalten ist
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#datenschutz');
    expect(buttonElement.textContent).toContain('Datenschutz'); 
  });

  // Test 3: Übersetzter Text für Impressum anzeigen
  it('should display the translated text for Impressum', () => {
    // Setzen eines Mock-Werts für die Übersetzung
    mockTranslationService.getTranslation.and.returnValue('Impressum');
    fixture.detectChanges();

    // Überprüfen, ob der Text "Impressum" im Button enthalten ist
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#impressum');
    expect(buttonElement.textContent).toContain('Impressum'); 
  });

  // Test 4: Übersetzter Text für Über uns anzeigen
  it('should display the translated text for Über uns', () => {
    // Setzen eines Mock-Werts für die Übersetzung
    mockTranslationService.getTranslation.and.returnValue('Über uns');
    fixture.detectChanges();

    // Überprüfen, ob der Text "Über uns" im Button enthalten ist
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#ueberUns');
    expect(buttonElement.textContent).toContain('Über uns'); 
  });

  // Test 5: RouterLink für Datenschutz funktioniert korrekt
  it('should have the correct routerLink for Datenschutz button', () => {
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#datenschutz');
    const routerLink = buttonElement.getAttribute('ng-reflect-router-link');
    
    expect(routerLink).toBe('/datenschutz'); // Überprüfen, ob der RouterLink korrekt gesetzt ist
  });

  // Test 6: RouterLink für Impressum funktioniert korrekt
  it('should have the correct routerLink for Impressum button', () => {
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#impressum');
    const routerLink = buttonElement.getAttribute('ng-reflect-router-link');
    
    expect(routerLink).toBe('/impressum'); // Überprüfen, ob der RouterLink korrekt gesetzt ist
  });

  // Test 7: RouterLink für Über uns funktioniert korrekt
  it('should have the correct routerLink for Über uns button', () => {
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('#ueberUns');
    const routerLink = buttonElement.getAttribute('ng-reflect-router-link');
    
    expect(routerLink).toBe('/about-us'); // Überprüfen, ob der RouterLink korrekt gesetzt ist
  });

  // Test 8: Prüfen, ob der Wechsel der Sprache korrekt funktioniert (switchLanguage)
  it('should call switchLanguage on TranslationService', () => {
    spyOn(component.translationService, 'switchLanguage');
    component.switchLanguage();
    expect(component.translationService.switchLanguage).toHaveBeenCalled(); // Überprüfen, ob die Methode aufgerufen wurde
  });
});




