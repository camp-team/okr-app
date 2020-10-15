import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrDialogComponent } from './okr-dialog.component';

describe('OkrDialogComponent', () => {
  let component: OkrDialogComponent;
  let fixture: ComponentFixture<OkrDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OkrDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
