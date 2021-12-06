import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TennisFieldComponent } from './simulation.component';

describe('TennisFieldComponent', () => {
  let component: TennisFieldComponent;
  let fixture: ComponentFixture<TennisFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TennisFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
