import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFirstOkrDialogComponent } from './create-first-okr-dialog.component';

describe('CreateFirstOkrDialogComponent', () => {
  let component: CreateFirstOkrDialogComponent;
  let fixture: ComponentFixture<CreateFirstOkrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFirstOkrDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFirstOkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
