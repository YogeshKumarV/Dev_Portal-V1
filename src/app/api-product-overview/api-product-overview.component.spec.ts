import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiProductOverviewComponent } from './api-product-overview.component';

describe('ApiProductOverviewComponent', () => {
  let component: ApiProductOverviewComponent;
  let fixture: ComponentFixture<ApiProductOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiProductOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApiProductOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
