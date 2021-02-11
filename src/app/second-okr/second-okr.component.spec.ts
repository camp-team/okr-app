import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondOkrComponent } from './second-okr.component';

describe('SecondOkrComponent', () => {
  let component: SecondOkrComponent;
  let fixture: ComponentFixture<SecondOkrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondOkrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
