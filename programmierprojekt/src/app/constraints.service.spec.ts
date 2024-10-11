import { TestBed } from '@angular/core/testing';
import { ConstraintsService } from './constraints.service';

describe('ConstraintsService', () => {
  let service: ConstraintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstraintsService);
  });

  // 1. Test to check if the service is created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // 2. Test setting constraints
  it('should set constraints correctly', () => {
    const newConstraints = [
      {
        name: 'Constraint 1',
        terms: [{ name: 'x1', coef: 2 }, { name: 'x2', coef: 3 }],
        relation: '<=',
        rhs: 10
      },
      {
        name: 'Constraint 2',
        terms: [{ name: 'x3', coef: 4 }],
        relation: '>=',
        rhs: 5
      }
    ];

    service.setConstraints(newConstraints);

    expect(service.getConstraints()).toEqual(newConstraints);
  });

  // 3. Test getting constraints
  it('should return an empty array if no constraints are set', () => {
    expect(service.getConstraints()).toEqual([]);
  });

  // 4. Test that converting an equation returns zero for missing variables
  it('should return 0 if variables are missing', () => {
    const constraint = {
      name: 'Constraint 1',
      terms: [{ name: 'x1', coef: 2 }, { name: 'x2', coef: 3 }],
      relation: '<=',
      rhs: 10
    };

    const equation = service.convertConstraintToEquation(constraint);
    const values = {};
    const result = equation(values);

    expect(result).toBe(0);
  });
});
