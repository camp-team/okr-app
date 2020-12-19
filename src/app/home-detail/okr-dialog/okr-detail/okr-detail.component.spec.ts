import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrDetailComponent } from './okr-detail.component';

describe('OkrDetailComponent', () => {
  let component: OkrDetailComponent;
  let fixture: ComponentFixture<OkrDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OkrDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
