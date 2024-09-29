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
});
