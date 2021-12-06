import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadsDatasetComponent } from './uploads-dataset.component';

describe('UploadsDatasetComponent', () => {
  let component: UploadsDatasetComponent;
  let fixture: ComponentFixture<UploadsDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadsDatasetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
