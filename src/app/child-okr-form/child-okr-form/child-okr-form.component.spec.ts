import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildOkrFormComponent } from './child-okr-form.component';

describe('ChildOkrFormComponent', () => {
  let component: ChildOkrFormComponent;
  let fixture: ComponentFixture<ChildOkrFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildOkrFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildOkrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
