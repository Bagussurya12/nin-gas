import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealOrderingSystem } from './meal-ordering-system';

describe('MealOrderingSystem', () => {
  let component: MealOrderingSystem;
  let fixture: ComponentFixture<MealOrderingSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealOrderingSystem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealOrderingSystem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
