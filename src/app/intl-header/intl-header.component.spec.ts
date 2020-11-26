import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlHeaderComponent } from './intl-header.component';

describe('IntlHeaderComponent', () => {
  let component: IntlHeaderComponent;
  let fixture: ComponentFixture<IntlHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntlHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntlHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
