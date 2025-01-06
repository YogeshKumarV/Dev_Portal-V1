import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApiProductsComponent } from './view-api-products.component';

describe('ViewApiProductsComponent', () => {
  let component: ViewApiProductsComponent;
  let fixture: ComponentFixture<ViewApiProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewApiProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewApiProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
