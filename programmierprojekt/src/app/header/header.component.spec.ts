import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslationService } from '../translationservice';
import { By } from '@angular/platform-browser'; 
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translationService: TranslationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent], 
      providers: [TranslationService],  
      imports: [Router]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService); 
    fixture.detectChanges();
  });

  // Testet, ob die Komponente korrekt erstellt wird
  it('should create the HeaderComponent', () => {
    expect(component).toBeTruthy();
  });

  // Testet, ob das Logo korrekt angezeigt wird
  it('should display the logo image', () => {
    const logo = fixture.debugElement.query(By.css('#logo_header')).nativeElement;
    expect(logo).toBeTruthy();
    expect(logo.src).toContain('logo.png'); 
  });

  // Testet, ob der Titel und Untertitel korrekt angezeigt werden
  it('should display the correct title and subtitle', () => {
    const title = translationService.getTranslation('title');
    const subtitle = translationService.getTranslation('subtitle');
    
    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();

    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    const subtitleElement = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(titleElement.textContent).toContain(title);
    expect(subtitleElement.textContent).toContain(subtitle); 
  });

  // Testet, ob der Sprachwechselbutton funktioniert
  it('should call switchLanguage method when the button is clicked', () => {
    spyOn(component, 'switchLanguage');  // Überwacht die switchLanguage-Funktion
    const button = fixture.debugElement.query(By.css('#sprache-aendern')).nativeElement;
    button.click(); 
    expect(component.switchLanguage).toHaveBeenCalled();  
  });

  // Testet, ob die Sprachwechselübersetzung korrekt angezeigt wird
  it('should display the correct translation for language switch button', () => {
    const switchLangText = translationService.getTranslation('switchLanguage');
    const buttonElement = fixture.debugElement.query(By.css('#sprache-aendern')).nativeElement;
    expect(buttonElement.textContent).toContain(switchLangText); 
  });

  // Testet, ob das Home-Icon vorhanden ist und korrekt gerendert wird
  it('should display the home icon with correct router link', () => {
    const homeIcon = fixture.debugElement.query(By.css('#home-icon')).nativeElement;
    const homeLink = fixture.debugElement.query(By.css('[router]')).nativeElement;

    expect(homeIcon).toBeTruthy();
    expect(homeLink.getAttribute('router')).toBe(''); 
  });
});