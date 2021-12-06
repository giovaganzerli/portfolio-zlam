import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundPercentageComponent } from './round-percentage.component';

describe('RoundPercentageComponent', () => {
  let component: RoundPercentageComponent;
  let fixture: ComponentFixture<RoundPercentageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundPercentageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
