import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighsSolverComponent } from './highs-solver.component';

describe('HighsSolverComponent', () => {
  let component: HighsSolverComponent;
  let fixture: ComponentFixture<HighsSolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighsSolverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighsSolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.someProperty).toEqual('defaultValue');
  });

  it('should call the solver method when invoked', () => {
    spyOn(component, 'solve');
    component.solve();
    expect(component.solve).toHaveBeenCalled();
  });

  it('should update the result correctly', () => {
    component.someInput = 5;
    component.solve();
    expect(component.result).toEqual(expectedResult); 
  });

  it('should render the output in the template', () => {
    component.result = 'Some Output';
    fixture.detectChanges();
    const outputElement = fixture.debugElement.query(By.css('.output-class'));
    expect(outputElement.nativeElement.textContent).toContain('Some Output');
  });
});