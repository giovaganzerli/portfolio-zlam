import {Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-smartdata',
    templateUrl: './smartdata.component.html',
    styleUrls: ['./smartdata.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class SmartdataComponent implements OnInit {

    @ViewChild('reportTennisField') reportTennisField: ElementRef;
    @ViewChild('reportTennisFieldStatsAd') reportTennisFieldStatsAd: ElementRef;
    @ViewChild('reportTennisFieldStatsDeuce') reportTennisFieldStatsDeuce: ElementRef;

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
            elements: {},
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
                if (simulation.elements && simulation.type === 'smartdata') {

                    this.reportSelected.component.status = 'view';
                    this.reportSelected.component.elements = simulation.elements;

                    this.onComponentSave();
                }
            }
        });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
        this.reportTennisField.nativeElement.innerHTML = (this.reportSelected.component.elements.hasOwnProperty('field')) ? this.reportSelected.component.elements.field : '';
        this.reportTennisFieldStatsAd.nativeElement.innerHTML = (this.reportSelected.component.elements.hasOwnProperty('stats')) ? this.reportSelected.component.elements.stats.ad : '';
        this.reportTennisFieldStatsDeuce.nativeElement.innerHTML = (this.reportSelected.component.elements.hasOwnProperty('stats')) ? this.reportSelected.component.elements.stats.deuce : '';
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }
}
