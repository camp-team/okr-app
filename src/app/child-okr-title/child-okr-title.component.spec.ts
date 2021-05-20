import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondOkrTitleComponent } from './child-okr-title.component';

describe('SecondOkrTitleComponent', () => {
  let component: SecondOkrTitleComponent;
  let fixture: ComponentFixture<SecondOkrTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondOkrTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondOkrTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
