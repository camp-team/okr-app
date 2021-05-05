import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedChildOkrTitleComponent } from './completed-child-okr-title.component';

describe('CompletedChildOkrTitleComponent', () => {
  let component: CompletedChildOkrTitleComponent;
  let fixture: ComponentFixture<CompletedChildOkrTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedChildOkrTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedChildOkrTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
