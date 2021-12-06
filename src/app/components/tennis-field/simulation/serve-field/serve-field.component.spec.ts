import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeFieldComponent } from './serve-field.component';

describe('ServeFieldComponent', () => {
  let component: ServeFieldComponent;
  let fixture: ComponentFixture<ServeFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
