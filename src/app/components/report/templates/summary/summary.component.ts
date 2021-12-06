import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class SummaryComponent implements OnInit {

    dataSummarySelected;

    @Input() resultsData;
    @Input() reportName;
    @Input() reportId;
    @Input() reportSelected;
    @Input() filtersSelected;
    @Output() exportComponentEmit = new EventEmitter();

    /*summaryData: any;
    selectedColor: string;
    textToAdd: string;
    dropDownOpen: boolean;
    editing: boolean;*/

    constructor(
        public generalService: GeneralService,
        private smartdataService: SmartdataService,
        private dataExchangeService: DataExchangeService
    ) {
        /*this.summaryData = [];
        this.dropDownOpen = false;
        this.selectedColor = 'grey';
        this.textToAdd = '';
        this.editing = true;*/
    }

    initComponentData() {

        this.reportSelected.component = {
            status: 'edit',
            data: []
        };
    }

    initSelectedSummaryData() {
        this.dataSummarySelected = {
            dropdown: false,
            color: 'grey',
            description: ''
        };
    }

    /*toggleDropDown(){
        this.dropDownOpen = ! this.dropDownOpen;
    }

    setColor(c){
        this.selectedColor = c;
        this.dropDownOpen = false;
    }

    addSummaryRow(){
        this.summaryData.push({
            color: this.selectedColor,
            text: this.textToAdd
        });
        this.selectedColor = 'grey';
        this.textToAdd = '';
    }

    saveSummary(){
        this.editing = false;
        this.exportComponent();
    }*/

    onDataInsert(data) {
        this.reportSelected.component.data.push({
            color: data.color,
            description: data.description
        });
        this.initSelectedSummaryData();
    }

    onComponentSave() {
        this.reportSelected.component.status = 'view';
        this.exportComponent();
    }

    ngOnInit(): void {
        this.initSelectedSummaryData();
        if ((this.reportName !== 'custom' && !this.reportId) || !Object.keys(this.reportSelected.component).length) {
            this.initComponentData();
        }
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }

}
