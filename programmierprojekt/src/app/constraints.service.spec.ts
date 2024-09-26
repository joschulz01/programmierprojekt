import { TestBed } from '@angular/core/testing';

import { ConstraintsService } from './constraints.service';

describe('ConstraintsService', () => {
  let service: ConstraintsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstraintsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
