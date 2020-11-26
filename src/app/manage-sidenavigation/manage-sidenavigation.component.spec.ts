import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSidenavigationComponent } from './manage-sidenavigation.component';

describe('ManageSidenavigationComponent', () => {
  let component: ManageSidenavigationComponent;
  let fixture: ComponentFixture<ManageSidenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSidenavigationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSidenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
