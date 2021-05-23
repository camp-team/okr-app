import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildOkrTitleComponent } from './child-okr-title.component';

describe('ChildOkrTitleComponent', () => {
  let component: ChildOkrTitleComponent;
  let fixture: ComponentFixture<ChildOkrTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildOkrTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildOkrTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
