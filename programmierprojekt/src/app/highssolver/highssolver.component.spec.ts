import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighssolverComponent } from './highssolver.component';

describe('HighssolverComponent', () => {
  let component: HighssolverComponent;
  let fixture: ComponentFixture<HighssolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighssolverComponent]
    })
<<<<<<< Updated upstream
    .compileComponents();
=======
      .compileComponents();
>>>>>>> Stashed changes

    fixture = TestBed.createComponent(HighssolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
