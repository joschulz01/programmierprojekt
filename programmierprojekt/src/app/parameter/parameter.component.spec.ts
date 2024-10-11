import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParameterComponent } from './parameter.component';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    declarations: [ ParameterComponent ],
  }).compileComponents();
});

beforeEach(() => {
  fixture = TestBed.createComponent(ParameterComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

// Test, ob die Komponente erfolgreich erstellt wurde
it('should create the component', () => {
  expect(component).toBeTruthy();
});

// Test, ob der Zählerwert zu Beginn 0 ist
it('should have count initially set to 0', () => {
  expect(component.count).toBe(0);
});

// Test der Funktion "increment"
it('should increment count when increment is called', () => {
  component.increment();
  expect(component.count).toBe(1);
});

// Test, ob der Zählerwert bei einem Button-Klick erhöht wird
it('should increment count when button is clicked', () => {
  const button = fixture.nativeElement.querySelector('button');
  button.click();
  expect(component.count).toBe(1);
});