import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSecondOkrDialogComponent } from './delete-second-okr-dialog.component';

describe('DeleteSecondOkrDialogComponent', () => {
  let component: DeleteSecondOkrDialogComponent;
  let fixture: ComponentFixture<DeleteSecondOkrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSecondOkrDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSecondOkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
