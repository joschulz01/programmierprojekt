import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelComponent } from './model.component';

// eslint-disable-next-line @typescript-eslint/no-empty-function
window.ResizeObserver = class {
  observe() { void 0; }
  unobserve() { void 0; }
  disconnect() { void 0; }
};

describe('ModelComponent', () => {
  let component: ModelComponent;
  let fixture: ComponentFixture<ModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
