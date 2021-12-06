import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeInsightComponent } from './serve-insight.component';

describe('ServeInsightComponent', () => {
  let component: ServeInsightComponent;
  let fixture: ComponentFixture<ServeInsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeInsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
