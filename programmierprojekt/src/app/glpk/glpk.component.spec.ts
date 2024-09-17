import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlpkComponent } from './glpk.component';

describe('GlpkComponent', () => {
  let component: GlpkComponent;
  let fixture: ComponentFixture<GlpkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlpkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlpkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
