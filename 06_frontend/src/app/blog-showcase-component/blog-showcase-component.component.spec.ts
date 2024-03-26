import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogShowcaseComponentComponent } from './blog-showcase-component.component';

describe('BlogShowcaseComponentComponent', () => {
  let component: BlogShowcaseComponentComponent;
  let fixture: ComponentFixture<BlogShowcaseComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogShowcaseComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogShowcaseComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
