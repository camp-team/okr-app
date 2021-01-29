import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrDeleteDialogComponent } from './okr-delete-dialog.component';

describe('OkrDeleteDialogComponent', () => {
  let component: OkrDeleteDialogComponent;
  let fixture: ComponentFixture<OkrDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OkrDeleteDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
