import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { TranslationService } from '../translationservice';
import { Router} from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let translationServiceSpy: jasmine.SpyObj<TranslationService>;

  beforeEach(async () => {
    const translationSpy = jasmine.createSpyObj('TranslationService', ['getTranslation', 'switchLanguage']);

    await TestBed.configureTestingModule({
      imports: [Router],  
      declarations: [MenuComponent],
      providers: [{ provide: TranslationService, useValue: translationSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    translationServiceSpy = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    fixture.detectChanges();
  });

  // Test 1: Überprüfen, ob die Komponente korrekt erstellt wird
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Überprüfen, ob die Übersetzungen korrekt abgerufen werden
  it('should display correct menu translations', () => {
    translationServiceSpy.getTranslation.and.callFake((key: string) => {
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
    expect(translationServiceSpy.switchLanguage).toHaveBeenCalled();
  });
});
