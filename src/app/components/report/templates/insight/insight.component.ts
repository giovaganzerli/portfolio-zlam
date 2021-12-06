import {Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-insight',
    templateUrl: './insight.component.html',
    styleUrls: ['./insight.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class InsightComponent implements OnInit {

    @ViewChild('reportTennisFieldInsightGraphBars') reportTennisFieldInsightGraphBars: ElementRef;
    @ViewChild('reportTennisFieldInsightShotPlacement') reportTennisFieldInsightShotPlacement: ElementRef;

    @Input() resultsData;
    @Input() reportName;
    @Input() reportId;
    @Input() reportSelected;
    @Input() filtersSelected;
    @Output() exportComponentEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private smartdataService: SmartdataService,
        private dataExchangeService: DataExchangeService
    ) { }

    // INIT HTML
    initElementHTML(element) {
        return this.reportSelected.component.el[element];
    }

    initComponentData() {

        this.reportSelected.component = {
            status: 'edit',
            elements: '',
            data: {}
        };

        if (this.filtersSelected) {
            this.reportSelected.component.data.player = this.filtersSelected.player;
            this.reportSelected.component.data.smartdata = this.filtersSelected.smartdata;
        }
    }

    onComponentSave() {
        this.reportSelected.component.status = 'view';
        this.exportComponent();
    }

    ngOnInit(): void {
        if ((this.reportName !== 'custom' && !this.reportId) || !Object.keys(this.reportSelected.component).length) {
            this.initComponentData();
        }
        this.dataExchangeService.dataSimulation.subscribe((simulation) => {
            if (this.reportSelected.component.status === 'edit') {
                if (simulation.elements && simulation.type === 'insight') {

                    this.reportSelected.component.data.insight = simulation.data;

                    this.reportSelected.component.status = 'view';
                    this.reportSelected.component.elements = simulation.elements;

                    this.onComponentSave();
                }
            }
        });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
        this.reportTennisFieldInsightGraphBars.nativeElement.innerHTML = (this.reportSelected.component.elements.hasOwnProperty('insight')) ? this.reportSelected.component.elements.insight.graph_bars : '';
        this.reportTennisFieldInsightShotPlacement.nativeElement.innerHTML = (this.reportSelected.component.elements.hasOwnProperty('insight')) ? this.reportSelected.component.elements.insight.shot_placement : '';
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }

}
