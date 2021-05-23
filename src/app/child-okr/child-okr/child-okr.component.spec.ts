import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildOkrComponent } from './child-okr.component';

describe('ChildOkrComponent', () => {
  let component: ChildOkrComponent;
  let fixture: ComponentFixture<ChildOkrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildOkrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
