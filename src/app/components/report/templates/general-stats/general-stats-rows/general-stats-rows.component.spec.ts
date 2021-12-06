import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralStatsRowsComponent } from './general-stats-rows.component';

describe('GeneralStatsRowsComponent', () => {
  let component: GeneralStatsRowsComponent;
  let fixture: ComponentFixture<GeneralStatsRowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralStatsRowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralStatsRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
