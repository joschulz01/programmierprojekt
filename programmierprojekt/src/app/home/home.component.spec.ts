import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TranslationService } from '../translationservice';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let translationServiceMock: jest.Mocked<TranslationService>;

  beforeEach(async () => {
    // Erstellen eines Mocks für den TranslationService
    translationServiceMock = {
      getTranslation: jest.fn(),
      switchLanguage: jest.fn(),
      getCurrentLanguage: jest.fn(),
      getTranslations: jest.fn(),
      currentLanguage: 'de',
      translations: {},
    } as jest.Mocked<TranslationService>;

    translationServiceMock.getTranslation.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        welcomeTitle: 'Willkommen',
        introText: 'Einführungstext',
        whyOurTool: 'Warum unser Tool?',
        whyOurToolDescription1: 'Beschreibung 1',
        ourCoreValues: 'Unsere Kernwerte',
        ourCoreValuesDescription: 'Beschreibung unserer Werte',
        ctaTitle: 'Handeln Sie jetzt!',
        ctaDescription: 'Beschreibung der Call to Action.',
        parameterButton: 'Parameter',
        highsSolverButton: 'Hochs Solver',
      };
      return translations[key] || key;
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [{ provide: TranslationService, useValue: translationServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // 1. Test to check if the component is created
  it('should create the HomeComponent', () => {
    expect(component).toBeTruthy();
  });

  // 2. Test to check the initial slide state
  it('should initialize the current slide to 0', () => {
    expect(component.currentSlide).toBe(0);
  });

  // 3. Test the slide show functionality
  it('should automatically transition to the next slide after 5 seconds', (done) => {
    jest.useFakeTimers();
    component.startSlideShow();

    expect(component.currentSlide).toBe(0);
    jest.advanceTimersByTime(5000);

    expect(component.currentSlide).toBe(1);
    jest.advanceTimersByTime(5000);

    expect(component.currentSlide).toBe(2);
    jest.advanceTimersByTime(5000);

    expect(component.currentSlide).toBe(0);
    jest.useRealTimers();
    done();
  });

  // 4. Test manual slide navigation
  it('should navigate to the specified slide when goToSlide is called', () => {
    component.goToSlide(1);
    expect(component.currentSlide).toBe(1);

    component.goToSlide(2);
    expect(component.currentSlide).toBe(2);
  });

  // 5. Test the language switch functionality
  it('should call switchLanguage on TranslationService when switchLanguage is called', () => {
    component.switchLanguage();
    expect(translationServiceMock.switchLanguage).toHaveBeenCalled();
  });

  // 6. Test if translations are rendered correctly
  it('should render the correct translations for the title', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h1.page-title');
    expect(titleElement.textContent).toContain('Willkommen');
  });
});
