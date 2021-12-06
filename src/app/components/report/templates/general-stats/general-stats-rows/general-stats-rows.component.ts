import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../../services/general/general.service';
import { SmartdataService } from '../../../../../services/smartdata/smartdata.service';
import { ReportService } from '../../../../../services/report/report.service';
import { DataExchangeService } from '../../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-general-stats-rows',
    templateUrl: './general-stats-rows.component.html',
    styleUrls: ['./general-stats-rows.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class GeneralStatsRowsComponent implements OnInit {

    @Input() rowsData;
    @Input() rowsType;
    @Input() settings;
    @Output() exportRowEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private smartdataService: SmartdataService,
        private reportService: ReportService,
        private dataExchangeService: DataExchangeService
    ) { }

    onRowActive(row, i) {
        if (!this.rowsData.data[i].hasOwnProperty('active')) {
            this.rowsData.data[i].active = true;
        } else {
            this.rowsData.data[i].active = !this.rowsData.data[i].active;
        }
        this.exportRowEmit.emit(this.rowsData);
    }

    ngOnInit() {
        // console.log(this.dataRows);
    }

}
