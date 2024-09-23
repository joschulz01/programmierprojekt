import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
