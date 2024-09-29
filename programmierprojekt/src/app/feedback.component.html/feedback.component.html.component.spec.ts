import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponentHtmlComponent } from './feedback.component.html.component';

describe('FeedbackComponentHtmlComponent', () => {
  let component: FeedbackComponentHtmlComponent;
  let fixture: ComponentFixture<FeedbackComponentHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackComponentHtmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackComponentHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
