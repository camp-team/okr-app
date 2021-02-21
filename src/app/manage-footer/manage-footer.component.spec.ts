import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFooterComponent } from './manage-footer.component';

describe('ManageFooterComponent', () => {
  let component: ManageFooterComponent;
  let fixture: ComponentFixture<ManageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageFooterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
