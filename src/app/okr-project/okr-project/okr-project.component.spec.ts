import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkrProjectComponent } from './okr-project.component';

describe('OkrProjectComponent', () => {
  let component: OkrProjectComponent;
  let fixture: ComponentFixture<OkrProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OkrProjectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkrProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
