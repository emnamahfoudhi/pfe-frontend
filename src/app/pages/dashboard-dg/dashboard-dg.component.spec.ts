import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDgComponent } from './dashboard-dg.component';

describe('DashboardDgComponent', () => {
  let component: DashboardDgComponent;
  let fixture: ComponentFixture<DashboardDgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
