import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDetailTitleComponent } from './home-detail-title.component';

describe('HomeDetailTitleComponent', () => {
  let component: HomeDetailTitleComponent;
  let fixture: ComponentFixture<HomeDetailTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeDetailTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDetailTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
