import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageComponent } from './language.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  // 1. Test to check if the component is created
  it('should create the LanguageComponent', () => {
    expect(component).toBeTruthy();
  });

  // 2. Test to check if the default language is set correctly
  it('should have the default language as English', () => {
    const defaultLanguage = 'EN'; 
    expect(component.currentLanguage).toEqual(defaultLanguage); 
  });

  // 3. Test for language switch functionality
  it('should switch language to German when switchLanguage is called', () => {
    component.switchLanguage();
    fixture.detectChanges(); 
    const language = component.currentLanguage;
    expect(language).toEqual('DE');
  });

  // 4. Test to check if the translated text is correctly rendered in the UI
  it('should render the correct translation for the title', () => {
    component.currentLanguage = 'EN';
    fixture.detectChanges();
    const titleElement = debugElement.query(By.css('h1')).nativeElement; 
    expect(titleElement.textContent).toContain('Operations Research Tool'); 
  });

  it('should render the German translation for the title after language switch', () => {
    component.switchLanguage();
    fixture.detectChanges();
    const titleElement = debugElement.query(By.css('h1')).nativeElement; 
    expect(titleElement.textContent).toContain('Operations Research Tool');
  });
});