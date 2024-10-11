import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService } from '../../translationservice';
import { ImpressumComponent } from './impressum.component';



describe('ImpressumComponent', () => {
  let component: ImpressumComponent;
  let fixture: ComponentFixture<ImpressumComponent>;
  let translationService: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpressumComponent],
      providers: [TranslationService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpressumComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  // Testet, ob die Komponente erstellt wird
  it('should create the Impressum component', () => {
    expect(component).toBeTruthy();
  });

  // Testet, ob die Übersetzungen für den Titel des Impressums korrekt abgerufen werden
  it('should display the correct imprint title from the translation service', () => {
    const title = translationService.getTranslation('imprintTitle');
    expect(title).toBeDefined();
  });

  // Testet die Anzeige der Universität und der Adresse
  it('should display the university name and contact information', () => {
    const universityName = translationService.getTranslation('universityName');
    const addressElement = fixture.nativeElement.querySelector('address');

    expect(universityName).toBeDefined(); // Überprüft, dass der Name der Universität geladen wird
    expect(addressElement).toBeTruthy(); // Überprüft, dass das Adresselement existiert
    expect(addressElement.textContent).toContain('hs-osnabrueck.de'); // Überprüft die Adresse
  });

  // Testet, ob das Entwicklerteam korrekt angezeigt wird
  it('should display the team member names', () => {
    const teamMembers = fixture.nativeElement.querySelectorAll('ul li');

    expect(teamMembers.length).toBeGreaterThan(0); // Überprüft, dass mindestens ein Teammitglied existiert
    expect(teamMembers[0].textContent).toContain('Nadine Arning'); // Überprüft den Namen des ersten Mitglieds
  });

  // Testet den Sprachwechsel
  it('should switch language when switchLanguage is called', () => {
    const initialLanguage = translationService.getCurrentLanguage();
    component.switchLanguage();
    const newLanguage = translationService.getCurrentLanguage();

    expect(newLanguage).not.toBe(initialLanguage); // Überprüfen, dass die Sprache sich geändert hat
  });
});

