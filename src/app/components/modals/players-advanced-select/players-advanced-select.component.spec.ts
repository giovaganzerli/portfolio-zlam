import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersAdvancedSelectComponent } from './players-advanced-select.component';

describe('PlayersAdvancedSelectComponent', () => {
  let component: PlayersAdvancedSelectComponent;
  let fixture: ComponentFixture<PlayersAdvancedSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersAdvancedSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersAdvancedSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
