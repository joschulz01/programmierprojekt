import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelComponent } from './model.component';
import { ConstraintsService } from '../constraints.service';
import { of } from 'rxjs';
import { Chart } from 'chart.js';

interface Constraint {
  name: string;
  terms: { name: string; coef: number }[];
  relation: string;
  rhs: number;
}

class MockConstraintsService {
  constraintsUpdated = of(null);
  getConstraints(): Constraint[] {
    return [
      { name: 'constraint1', terms: [{ name: 'x1', coef: 1 }], relation: '<=', rhs: 4 },
      { name: 'constraint2', terms: [{ name: 'x1', coef: 2 }, { name: 'x2', coef: 1 }], relation: '>=', rhs: 6 },
    ];
  }
  convertConstraintToEquation(constraint: Constraint): (values: Record<string, number>) => number {
    return (values) => values['x1'] * 1;
  }
}

describe('ModelComponent', () => {
  let component: ModelComponent;
  let fixture: ComponentFixture<ModelComponent>;
  let constraintsService: ConstraintsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelComponent],
      providers: [{ provide: ConstraintsService, useClass: MockConstraintsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelComponent);
    component = fixture.componentInstance;
    constraintsService = TestBed.inject(ConstraintsService);
    fixture.detectChanges();
  });

  // Test 1: Komponente sollte erstellt werden
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Überprüfen, dass die checkInputCount Methode richtig funktioniert
  it('should return true for valid input count', () => {
    component.xWert = 5;
    component.yWert = 3;
    expect(component.checkInputCount()).toBeTrue();
  });

  it('should return false for invalid input count', () => {
    component.xWert = 5;
    component.yWert = 3;
    (component as any)['extraInput'] = 2;
    expect(component.checkInputCount()).toBeFalse();
  });

  // Test 3: Überprüfen, dass die Methode onSolve den Chart korrekt initialisiert
  it('should initialize the chart correctly', () => {
    spyOn(component, 'checkInputCount').and.returnValue(true);
    spyOn(constraintsService, 'getConstraints').and.callThrough();

    component.onSolve();

    expect(component.chart).toBeDefined();
    expect(constraintsService.getConstraints).toHaveBeenCalled();
  });

  // Test 4: Überprüfen, dass der Chart zerstört wird, wenn er existiert
  it('should destroy the previous chart before creating a new one', () => {
    spyOn(component, 'checkInputCount').and.returnValue(true);
    component.chart = new Chart('myChart', {} as any);
    spyOn(component.chart, 'destroy');

    component.onSolve();

    expect(component.chart.destroy).toHaveBeenCalled();
  });

  // Test 5: Überprüfen, dass keine Lösung erfolgt, wenn zu viele Inputs übergeben werden
  it('should not proceed with solving if there are more than two inputs', () => {
    spyOn(component, 'checkInputCount').and.returnValue(false);
    spyOn(constraintsService, 'getConstraints');

    component.onSolve();

    expect(constraintsService.getConstraints).not.toHaveBeenCalled();
    expect(component.chart).toBeUndefined();
  });

  // Test 6: Überprüfen der Funktionalität von getVariableNames
  it('should extract correct variable names from the constraint', () => {
    const constraint: Constraint = {
      name: 'constraint1',
      terms: [
        { name: 'x1', coef: 1 },
        { name: 'x2', coef: 2 },
      ],
      relation: '<=',
      rhs: 4,
    };
    const variableNames = component.getVariableNames(constraint);
    expect(variableNames).toEqual(['x1', 'x2']);
  });
});
