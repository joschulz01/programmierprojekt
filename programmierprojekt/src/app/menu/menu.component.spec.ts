import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { TranslationService } from '../translationservice';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let translationServiceMock: jest.Mocked<TranslationService>;

  beforeEach(async () => {
    // Erstellen eines vollständigen Mocks für den TranslationService
    const translationSpy = {
      getTranslation: jest.fn(),
      switchLanguage: jest.fn(),
      getTranslations: jest.fn(),
      getCurrentLanguage: jest.fn(),
      currentLanguage: 'en',
      translations: {},
    } as jest.Mocked<TranslationService>;

    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterTestingModule],
      providers: [{ provide: TranslationService, useValue: translationSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    translationServiceMock = TestBed.inject(TranslationService) as jest.Mocked<TranslationService>;
    fixture.detectChanges();
  });

  // Test 1: Überprüfen, ob die Komponente korrekt erstellt wird
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Überprüfen, ob die Übersetzungen korrekt abgerufen werden
  it('should display correct menu translations', () => {
    translationServiceMock.getTranslation.mockImplementation((key: string) => {
      switch (key) {
        case 'menuHome': return 'Home';
        case 'menuHiGHS': return 'HiGHS';
        case 'menuGLPK': return 'GLPK';
        case 'menuFeedback': return 'Feedback';
        default: return '';
      }
    });

    fixture.detectChanges();
    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.css('button span'));
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Home');
    expect(buttons[1].nativeElement.textContent.trim()).toBe('HiGHS');
    expect(buttons[2].nativeElement.textContent.trim()).toBe('GLPK');
    expect(buttons[3].nativeElement.textContent.trim()).toBe('Feedback');
  });

  // Test 3: Überprüfen der korrekten Router-Links
  it('should have correct routerLinks', () => {
    const buttons: DebugElement[] = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].attributes['ng-reflect-router-link']).toBe('');
    expect(buttons[1].attributes['ng-reflect-router-link']).toBe('/highs');
    expect(buttons[2].attributes['ng-reflect-router-link']).toBe('/parameter');
    expect(buttons[3].attributes['ng-reflect-router-link']).toBe('/feedback');
  });

  // Test 4: Überprüfen der Sprachwechselmethode
  it('should call switchLanguage when language change is requested', () => {
    component.switchLanguage();
    expect(translationServiceMock.switchLanguage).toHaveBeenCalled();
  });
});
