import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartdataComponent } from './smartdata.component';

describe('SmartdataComponent', () => {
  let component: SmartdataComponent;
  let fixture: ComponentFixture<SmartdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
