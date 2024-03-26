import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastStepPageComponent } from './last-step-page.component';

describe('LastStepPageComponent', () => {
  let component: LastStepPageComponent;
  let fixture: ComponentFixture<LastStepPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastStepPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastStepPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
