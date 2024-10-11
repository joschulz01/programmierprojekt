import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsComponent } from './about-us.component';
import { TranslationService } from '../../translationservice';
import { By } from '@angular/platform-browser';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let mockTranslationService: jest.Mocked<TranslationService>;

  beforeEach(async () => {
    mockTranslationService = {
      currentLanguage: 'de',
      translations: {},
      getTranslation: jest.fn(),
      switchLanguage: jest.fn(),
      getTranslations: jest.fn(),
      getCurrentLanguage: jest.fn(),
    } as jest.Mocked<TranslationService>;

    await TestBed.configureTestingModule({
      imports: [AboutUsComponent],
      providers: [{ provide: TranslationService, useValue: mockTranslationService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Überprüfen, ob die Komponente erstellt wurde
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Überprüfen, ob der Titel korrekt übersetzt wird
  it('should display the translated title', () => {
    mockTranslationService.getTranslation.mockReturnValue('Über uns');
    fixture.detectChanges();

    const h1Element: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1Element.textContent).toContain('Über uns');
  });

  // Test 3: Überprüfen, ob "Our Project" korrekt übersetzt wird
  it('should display translated "Our Project" section', () => {
    mockTranslationService.getTranslation.mockReturnValue('Unser Projekt');
    fixture.detectChanges();

    const h3Element: HTMLElement = fixture.nativeElement.querySelector('h3');
    expect(h3Element.textContent).toContain('Unser Projekt');
  });

  // Test 4: Überprüfen, ob der Parallax-Absatz "Our Approach" korrekt übersetzt wird
  it('should display translated "Our Approach" section', () => {
    mockTranslationService.getTranslation.mockReturnValue('Unser Ansatz');
    fixture.detectChanges();

    const h3Elements = fixture.nativeElement.querySelectorAll('h3');
    const secondH3Element = h3Elements[1];
    expect(secondH3Element.textContent).toContain('Unser Ansatz');
  });

  // Test 5: Überprüfen, ob die Liste der Ansätze korrekt angezeigt wird
  it('should display translated features list', () => {
    const mockTranslations: Record<string, string> = {
      'aboutUsTitle': 'Über uns',
      'ourProjectTitle': 'Unser Projekt',
      'whatWeDevelopedTitle': 'Was wir entwickelt haben',
      'featureSolverIntegration': 'Solver-Integration',
      'featureVisualRepresentation': 'Visuelle Darstellung',
      'featureDownloadOptions': 'Download-Optionen',
    };

    mockTranslationService.getTranslation.mockImplementation((key: string) => mockTranslations[key] || key);
    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('#features-list li'));
    expect(listItems.length).toBe(3);

    const expectedValues = [
      'Solver-Integration',
      'Visuelle Darstellung',
      'Download-Optionen'
    ];

    listItems.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(expectedValues[index]);
    });
  });

  // Test 6: Überprüfen, ob der Sprachwechsel aufgerufen wird
  it('should call switchLanguage on the TranslationService', () => {
    component.switchLanguage();

    expect(component.translationService.switchLanguage).toHaveBeenCalled();
  });
});
