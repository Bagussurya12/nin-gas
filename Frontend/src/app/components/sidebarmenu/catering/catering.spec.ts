import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catering } from './catering';

describe('Catering', () => {
  let component: Catering;
  let fixture: ComponentFixture<Catering>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catering]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catering);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
