import { TestBed } from '@angular/core/testing';
import { UmformungService } from './umformung.service';

describe('UmformungService', () => {
  let service: UmformungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UmformungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test der Funktion umformen
  describe('umformen', () => {
    it('should correctly format the input string for linear programming', () => {
      const input = `
        Maximize Objective: 3*x1 + 2*x2;
        s.t.
        x1 + x2 <= 4;
        3*x1 + 2*x2 <= 6;
      `;
      const expectedOutput = `Maximize
  3 x1 + 2 x2
Subject To
  x1 + x2 <= 4
  3 x1 + 2 x2 <= 6
End`;
      
      const result = service.umformen(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle edge cases where the input is empty', () => {
      const input = ``;
      const expectedOutput = `Maximize\n  \nSubject To\nEnd`;
      
      const result = service.umformen(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  // Test der Funktion umformenxy
  describe('umformenxy', () => {
    it('should replace variables x and y with x1 and x2 respectively', () => {
      const input = `
        Maximize Objective: 5*x + 3*y;
        s.t.
        x + y <= 10;
        2*x + y <= 8;
      `;
      const expectedOutput = `Maximize
  5 x1 + 3 x2
Subject To
  x1 + x2 <= 10
  2 x1 + x2 <= 8
End`;
      
      const result = service.umformenxy(input);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle input with no x or y variables', () => {
      const input = `
        Maximize Objective: 4*z;
        s.t.
        z <= 5;
      `;
      const expectedOutput = `Maximize
  4 z
Subject To
  z <= 5
End`;
      
      const result = service.umformenxy(input);
      expect(result).toEqual(expectedOutput);
    });
  });

  // Test der privaten Methode extractVariablen
  describe('extractVariablen', () => {
    it('should extract variables from a given line', () => {
      const line = '3*x1 + 2*x2 <= 6';
      const variablen = new Set<string>();
      
      service['extractVariablen'](line, variablen);
      expect(variablen.has('x1')).toBeTrue();
      expect(variablen.has('x2')).toBeTrue();
      expect(variablen.size).toBe(2);
    });
  });

  // Test der Zielfunktion-Formatierung
  describe('formatZielfunktion', () => {
    it('should correctly format the objective function', () => {
      const zielfunktion = '3*x1 + 2*x2;';
      const expected = '3 x1 + 2 x2';
      
      const result = service['formatZielfunktion'](zielfunktion);
      expect(result).toEqual(expected);
    });
  });

  // Test der Nebenbedingung-Formatierung
  describe('formatNebenbedingung', () => {
    it('should correctly format the constraint', () => {
      const nebenbedingung = 'x1 + x2 <= 4;';
      const expected = 'x1 + x2 <= 4';
      
      const result = service['formatNebenbedingung'](nebenbedingung);
      expect(result).toEqual(expected);
    });
  });
});