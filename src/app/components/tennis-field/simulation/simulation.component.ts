import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

// SERVICES
import { GeneralService } from '../../../services/general/general.service';
import {DataExchangeService} from '../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {

    // INIT SELECTED DATA
    modeSelected;
    fullScreen: boolean;

    @Input() filtersSelected: any;
    @Input() resultsData: any;

    constructor(
        private dataExchangeService: DataExchangeService,
        public generalService: GeneralService
    ) { }

    // INIT SELECTED DATA
    initModeSelectedData() {
        this.modeSelected = 'view';
    }

    // INIT EVENT
    onModeChange() {
        this.modeSelected = (this.modeSelected === 'select') ? 'view' : 'select';
    }

    ngOnInit() {
        this.initModeSelectedData();

        this.dataExchangeService.fullScreen.subscribe(val => {
            this.fullScreen = val;
        });
    }
}
