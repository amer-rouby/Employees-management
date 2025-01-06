import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesOfVacationsComponent } from './types-of-vacations.component';

describe('TypesOfVacationsComponent', () => {
  let component: TypesOfVacationsComponent;
  let fixture: ComponentFixture<TypesOfVacationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypesOfVacationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesOfVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
