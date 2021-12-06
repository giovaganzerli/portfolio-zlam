import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidinComponent } from './validin.component';

describe('ValidinComponent', () => {
  let component: ValidinComponent;
  let fixture: ComponentFixture<ValidinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
