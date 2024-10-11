import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsComponent } from './about-us.component';
import { TranslationService } from '../../translationservice';
import { By } from '@angular/platform-browser';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let mockTranslationService: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    // Erstellen eines Mock-TranslationService
    mockTranslationService = jasmine.createSpyObj('TranslationService', ['getTranslation']);

    await TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      providers: [{ provide: TranslationService, useValue: mockTranslationService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Überprüfen, ob die Komponente erstellt wurde
  it('should create', () => {
    expect(component).toBeTruthy(); // Prüfen, ob die Komponente erfolgreich erstellt wurde
  });

  // Test 2: Überprüfen, ob der Titel korrekt übersetzt wird
  it('should display the translated title', () => {
    mockTranslationService.getTranslation.and.returnValue('Über uns');
    fixture.detectChanges();

    const h1Element: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1Element.textContent).toContain('Über uns'); // Testet, ob der übersetzte Titel angezeigt wird
  });

  // Test 3: Überprüfen, ob "Our Project" korrekt übersetzt wird
  it('should display translated "Our Project" section', () => {
    mockTranslationService.getTranslation.and.returnValue('Unser Projekt');
    fixture.detectChanges();

    const h3Element: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(h3Element.textContent).toContain('Unser Projekt'); // Testet, ob der Abschnitt "Unser Projekt" korrekt geladen wird
  });

  // Test 4: Überprüfen, ob die Feature-Liste korrekt übersetzt wird
  it('should display translated features list', () => {
    const mockFeatures = ['Solver-Integration', 'Visuelle Darstellung', 'Download-Optionen'];
    mockTranslationService.getTranslation.and.returnValues(...mockFeatures);

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('ul li'));
    expect(listItems.length).toBe(3); // Überprüfen, ob 3 Listenpunkte gerendert werden

    listItems.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(mockFeatures[index]); // Überprüfen, ob die Listenpunkte korrekt übersetzt werden
    });
  });

  // Test 5: Überprüfen, ob der Parallax-Absatz "Our Approach" korrekt übersetzt wird
  it('should display translated "Our Approach" section', () => {
    mockTranslationService.getTranslation.and.returnValue('Unser Ansatz');
    fixture.detectChanges();

    const h3Element: HTMLElement = fixture.nativeElement.querySelector('h3:nth-of-type(2)');
    expect(h3Element.textContent).toContain('Unser Ansatz'); // Testet den Abschnitt "Unser Ansatz"
  });

  // Test 6: Überprüfen, ob die Liste der Ansätze korrekt angezeigt wird
  it('should display translated approach focus list', () => {
    const mockApproaches = ['Benutzerfreundlichkeit', 'Zusammenarbeit', 'Praktische Anwendung'];
    mockTranslationService.getTranslation.and.returnValues(...mockApproaches);

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('.container ul li'));
    expect(listItems.length).toBe(3); // Überprüfen, ob 3 Listenpunkte angezeigt werden

    listItems.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(mockApproaches[index]); // Überprüfen, ob die Listenpunkte korrekt sind
    });
  });

  // Test 7: Überprüfen, ob der Sprachwechsel aufgerufen wird
  it('should call switchLanguage on the TranslationService', () => {
    spyOn(component.translationService, 'switchLanguage');
    component.switchLanguage();

    expect(component.translationService.switchLanguage).toHaveBeenCalled(); // Überprüfen, ob die Methode switchLanguage aufgerufen wird
  });
});
