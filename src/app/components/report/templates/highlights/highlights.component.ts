import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-highlights',
    templateUrl: './highlights.component.html',
    styleUrls: ['./highlights.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class HighlightsComponent implements OnInit {

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

    initComponentData() {

        this.reportSelected.component = {
            status: 'edit',
            data: [],
            selected: []
        };

        if (this.resultsData.smartdata) {
            Object.keys(this.resultsData.smartdata).forEach((key, i) => {
                const smartdataType = this.generalService.findIntoArrayofObject(key, this.smartdataService.getSmartdataTypes(), 'id');
                this.reportSelected.component.data = this.smartdataService.translateSmartdataToString(this.resultsData.smartdata[key], smartdataType, this.filtersSelected);
            });
        }
    }

    onComponentInsert(value) {
        if (this.generalService.findIntoArrayofObject(value.description, this.reportSelected.component.selected, 'description')) {
            // tslint:disable-next-line:max-line-length
            this.reportSelected.component.selected = this.generalService.removeObjectFromArray(value.description, this.reportSelected.component.selected, 'description');
        } else {
            this.reportSelected.component.selected.push(value);
        }
    }

    onComponentSave() {
        this.reportSelected.component.status = 'view';
        this.exportComponent();
    }

    ngOnInit() {
        if ((this.reportName !== 'custom' && !this.reportId) || !Object.keys(this.reportSelected.component).length) {
            this.initComponentData();
        }
        this.dataExchangeService.dataDataview.subscribe((hightlights) => {
            if (this.reportSelected.component.status === 'edit') {
                if (hightlights.length) {
                    hightlights.forEach((hightlight) => {
                        this.onComponentInsert(hightlight);
                    });
                    this.onComponentSave();
                    this.dataExchangeService.setDataviewData([]);
                }
            }
        });
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }
}
