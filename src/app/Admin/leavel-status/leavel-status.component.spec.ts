import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavelStatusComponent } from './leavel-status.component';

describe('LeavelStatusComponent', () => {
  let component: LeavelStatusComponent;
  let fixture: ComponentFixture<LeavelStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeavelStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavelStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
