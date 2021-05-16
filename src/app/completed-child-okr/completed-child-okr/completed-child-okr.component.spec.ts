import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedChildOkrComponent } from './completed-child-okr.component';

describe('CompletedChildOkrComponent', () => {
  let component: CompletedChildOkrComponent;
  let fixture: ComponentFixture<CompletedChildOkrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedChildOkrComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedChildOkrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
