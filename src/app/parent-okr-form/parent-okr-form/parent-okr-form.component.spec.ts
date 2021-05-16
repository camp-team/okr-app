import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentOkrFormComponent } from './parent-okr-form.component';

describe('ParentOkrFormComponent', () => {
  let component: ParentOkrFormComponent;
  let fixture: ComponentFixture<ParentOkrFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParentOkrFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentOkrFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
