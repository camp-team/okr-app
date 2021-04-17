import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteOkrDialogComponent } from './complete-okr-dialog.component';

describe('CompleteOkrDialogComponent', () => {
  let component: CompleteOkrDialogComponent;
  let fixture: ComponentFixture<CompleteOkrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteOkrDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteOkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
