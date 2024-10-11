import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelComponent } from './model.component';
import { ConstraintsService } from '../constraints.service';
import { of } from 'rxjs';

jest.mock('chart.js', () => {
  return {
    Chart: Object.assign(
      jest.fn().mockImplementation(() => ({
        destroy: jest.fn(),
      })),
      {
        register: jest.fn(),
      }
    ),
  };
});


describe('ModelComponent', () => {
  let component: ModelComponent;
  let fixture: ComponentFixture<ModelComponent>;
  let constraintsServiceMock: any;

  beforeEach(async () => {
    constraintsServiceMock = {
      constraintsUpdated: of(),
      getConstraints: jest.fn().mockReturnValue([]),
      convertConstraintToEquation: jest.fn().mockReturnValue(() => 0),
    };

    await TestBed.configureTestingModule({
      imports: [ModelComponent],
      providers: [
        { provide: ConstraintsService, useValue: constraintsServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
