import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsApiComponent } from './api.component';

describe('ApiComponent', () => {
  let component: TestsApiComponent;
  let fixture: ComponentFixture<TestsApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
