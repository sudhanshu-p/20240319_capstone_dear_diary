import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProfilePageComponent } from './home-profile-page.component';

describe('HomeProfilePageComponent', () => {
  let component: HomeProfilePageComponent;
  let fixture: ComponentFixture<HomeProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeProfilePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
