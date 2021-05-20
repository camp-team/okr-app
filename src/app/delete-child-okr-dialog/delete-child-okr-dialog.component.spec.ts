import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChildOkrDialogComponent } from './delete-child-okr-dialog.component';

describe('DeleteChildOkrDialogComponent', () => {
  let component: DeleteChildOkrDialogComponent;
  let fixture: ComponentFixture<DeleteChildOkrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteChildOkrDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteChildOkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
