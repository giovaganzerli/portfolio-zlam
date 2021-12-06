import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetsManagementComponent } from './datasets-management.component';

describe('DatasetsManagementComponent', () => {
  let component: DatasetsManagementComponent;
  let fixture: ComponentFixture<DatasetsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
