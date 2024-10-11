import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import { TranslationService } from '../translationservice';

// Verwenden Sie Jest-Mocks statt Jasmine-Spies
jest.mock('../translationservice');

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let translationServiceMock: jest.Mocked<TranslationService>;

  beforeEach(async () => {
    // Erstellen eines Mocks für den TranslationService
    const translationService = new TranslationService();
    translationService.getTranslation = jest.fn().mockImplementation((key: string) => key);
    translationService.switchLanguage = jest.fn();

    await TestBed.configureTestingModule({
      imports: [FeedbackComponent],
      providers: [{ provide: TranslationService, useValue: translationService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    translationServiceMock = TestBed.inject(TranslationService) as jest.Mocked<TranslationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the feedback form correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      translationServiceMock.getTranslation('feedbackTitle')
    );

    expect(compiled.querySelector('textarea')).toBeTruthy();

    expect(compiled.querySelector('button')?.textContent).toContain(
      translationServiceMock.getTranslation('submitFeedback')
    );
  });

  it('should have a submit button', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain(translationServiceMock.getTranslation('submitFeedback'));
  });

  it('should switch language when switchLanguage is called', () => {
    component.switchLanguage();

    expect(translationServiceMock.switchLanguage).toHaveBeenCalled();
  });

  it('should have correct form action and method', () => {
    const form = fixture.nativeElement.querySelector('form');

    expect(form.method).toBe('post');
    expect(form.action).toContain('https://formspree.io/f/xovqangy');
  });

  it('textarea should be required', () => {
    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea.required).toBeTruthy();
  });

});
