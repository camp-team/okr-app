import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOkrComponent } from './complete-okr.component';

describe('CompleteOkrComponent', () => {
  let component: CompleteOkrComponent;
  let fixture: ComponentFixture<CompleteOkrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteOkrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
