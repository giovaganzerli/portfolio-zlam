import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeStatsComponent } from './serve-stats.component';

describe('SimulationStatsComponent', () => {
    let component: ServeStatsComponent;
    let fixture: ComponentFixture<ServeStatsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ServeStatsComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ServeStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
