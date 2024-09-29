import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponentCssComponent } from './feedback.component.css.component';

describe('FeedbackComponentCssComponent', () => {
  let component: FeedbackComponentCssComponent;
  let fixture: ComponentFixture<FeedbackComponentCssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackComponentCssComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackComponentCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
