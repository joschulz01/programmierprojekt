import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import { TranslationService } from '../translationservice';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let translationServiceSpy: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    // Erstellen eines Spies (Mock) für den TranslationService
    const spy = jasmine.createSpyObj('TranslationService', ['getTranslation', 'switchLanguage']);

    // Konfigurieren des TestBettes für die Komponente und den Service
    await TestBed.configureTestingModule({
      imports: [FeedbackComponent], // Die Feedback-Komponente wird importiert
      providers: [{ provide: TranslationService, useValue: spy }], // Der TranslationService wird gemockt
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    translationServiceSpy = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    fixture.detectChanges();
  });

  // Test 1: Überprüft, ob die Komponente korrekt erstellt wurde
  it('should create', () => {
    expect(component).toBeTruthy(); // Erwartet, dass die Komponente erfolgreich instanziert wurde
  });

  // Test 2: Überprüft, ob das Formular korrekt gerendert wird
  it('should render the feedback form correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Überprüft, ob der Header den richtigen Text hat (abgerufen aus dem TranslationService)
    expect(compiled.querySelector('h1')?.textContent).toContain(
      translationServiceSpy.getTranslation('feedbackTitle')
    );
    
    // Überprüft, ob das Textarea-Feld vorhanden ist
    expect(compiled.querySelector('textarea')).toBeTruthy();
    
    // Überprüft, ob der Submit-Button den richtigen Text enthält
    expect(compiled.querySelector('button')?.textContent).toContain(
      translationServiceSpy.getTranslation('submitFeedback')
    );
  });

  // Test 3: Überprüft, ob der Submit-Button korrekt gerendert wird
  it('should have a submit button', () => {
    const button = fixture.nativeElement.querySelector('button');
    
    // Erwartet, dass der Button existiert und den korrekten Text hat
    expect(button).toBeTruthy();
    expect(button.textContent).toContain(translationServiceSpy.getTranslation('submitFeedback'));
  });

  // Test 4: Überprüft, ob die Methode switchLanguage korrekt ausgeführt wird
  it('should switch language when switchLanguage is called', () => {
    spyOn(component.translationService, 'switchLanguage'); // Überwacht den Aufruf von switchLanguage
    
    component.switchLanguage(); // Ruft die Methode auf
    
    // Erwartet, dass die Methode switchLanguage aufgerufen wurde
    expect(component.translationService.switchLanguage).toHaveBeenCalled();
  });

  // Test 5: Überprüft, ob das Formular die richtige Action-URL und Method verwendet
  it('should have correct form action and method', () => {
    const form = fixture.nativeElement.querySelector('form');
    
    // Erwartet, dass das Formular mit der Methode "post" und der korrekten URL gesendet wird
    expect(form.method).toBe('post');
    expect(form.action).toContain('https://formspree.io/f/xovqangy');
  });

  // Test 6: Überprüft, ob das Textarea-Feld als Pflichtfeld definiert ist
  it('textarea should be required', () => {
    const textarea = fixture.nativeElement.querySelector('textarea');
    
    // Erwartet, dass das Textarea-Feld das "required"-Attribut besitzt
    expect(textarea.required).toBeTruthy();
  });
});
