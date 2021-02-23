import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOkrTitleComponent } from './complete-okr-title.component';

describe('CompleteOkrTitleComponent', () => {
  let component: CompleteOkrTitleComponent;
  let fixture: ComponentFixture<CompleteOkrTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteOkrTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteOkrTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
