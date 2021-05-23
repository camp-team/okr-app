import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParentOkrDialogComponent } from './delete-parent-okr-dialog.component';

describe('DeleteParentOkrDialogComponent', () => {
  let component: DeleteParentOkrDialogComponent;
  let fixture: ComponentFixture<DeleteParentOkrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteParentOkrDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteParentOkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
