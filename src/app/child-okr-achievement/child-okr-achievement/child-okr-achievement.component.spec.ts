import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrAchievementComponent } from './child-okr-achievement.component';

describe('OkrAchievementComponent', () => {
  let component: OkrAchievementComponent;
  let fixture: ComponentFixture<OkrAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OkrAchievementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
