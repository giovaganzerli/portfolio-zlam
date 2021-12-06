import {Component, EventEmitter, Injectable, Input, OnInit, Output, OnDestroy} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import {GeneralService} from '../../../../services/general/general.service';
import {SmartdataService} from '../../../../services/smartdata/smartdata.service';
import {ReportService} from '../../../../services/report/report.service';
import {DataExchangeService} from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-general-stats',
    templateUrl: './general-stats.component.html',
    styleUrls: ['./general-stats.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class GeneralStatsComponent implements OnInit, OnDestroy {

    checkbox;
    report;
    subs;

    @Input() resultsData;
    @Input() reportName;
    @Input() reportId;
    @Input() reportSelected;
    @Input() filtersSelected;
    @Output() exportComponentEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private smartdataService: SmartdataService,
        private reportService: ReportService,
        private dataExchangeService: DataExchangeService
    ) {
    }

    // INIT DATA
    initComponentData() {
        this.reportSelected.component = {
            status: 'edit',
            data: [],
            selected: [],
            settings: {
                grouped_subtype_rows: true
            }
        };

        this.reportSelected.component.data = this.getReportTypeRow(this.reportSelected.subtype.id);

        if (this.reportName !== 'custom') {
            this.initReportData();

            const rowType = this.generalService.findIntoArrayofObject(this.reportSelected.type.id, this.report, 'id');
            const rowSubtype = this.generalService.findIntoArrayofObject(this.reportSelected.subtype.id, rowType.subtype, 'id');

            this.reportSelected.type = rowType;
            delete this.reportSelected.type.subtype;

            this.reportSelected.subtype.itemName = rowSubtype.itemName;
            this.reportSelected.subtype.description = rowSubtype.description;

            this.reportSelected.subtype.rows.forEach((row) => {
                const value = this.generalService.findIntoArrayofObject(row, this.reportSelected.component.data, 'id');
                if (value) {
                    this.onComponentInsert(value);
                }
            });
            if (this.reportSelected.settings.hasOwnProperty('grouped_subtype_rows')) {
                this.reportSelected.component.settings.grouped_subtype_rows = this.reportSelected.settings.grouped_subtype_rows;
            }
            this.onComponentSave();
        }
    }

    initReportData() {
        this.report = this.getReportTypes();
    }

    initCheckboxData() {
        this.checkbox = {
            type: false
        };
    }

    // GET DATA
    getReportTypes() {
        return this.reportService.getReportTypes();
    }

    getReportTypeRow(type) {
        return this.reportService.getReportTypeRows(type);
    }

    // INIT EVENT
    onRowUpdated(type, value, index) {
        this.reportSelected.component.selected[type][index] = value;
        this.exportComponent();
    }

    onComponentInsert(value) {
        // Se c'è già riumuovo il componente
        if (this.generalService.findIntoArrayofObject(value.id, this.reportSelected.component.selected, 'id')) {
            // tslint:disable-next-line:max-line-length
            this.reportSelected.component.selected = this.generalService.removeObjectFromArray(value.id, this.reportSelected.component.selected, 'id');
        } else { // Altrimenti lo aggiungo
            value.data = false;
            // tslint:disable-next-line:max-line-length
            if (this.resultsData.report.hasOwnProperty(this.reportSelected.subtype.id) && this.resultsData.report[this.reportSelected.subtype.id].hasOwnProperty(value.id)) {
                value.data = this.resultsData.report[this.reportSelected.subtype.id][value.id];
            }
            this.reportSelected.component.selected.push(value);
        }
    }

    onComponentSave() {

        const selected = {
            grouped: {},
            generic: [{
                id: '',
                itemName: '',
                data: []
            }]
        };

        this.reportSelected.component.status = 'view';

        this.reportSelected.component.selected.forEach((item) => {
            if (this.reportSelected.component.settings.grouped_subtype_rows && item.group.length) {
                item.group.forEach((group) => {
                    if (!selected.grouped.hasOwnProperty(group.id)) {
                        selected.grouped[group.id] = {
                            id: group.id,
                            itemName: group.itemName,
                            data: []
                        };
                    }
                    selected.grouped[group.id].data.push({
                        id: item.id,
                        itemName: item.itemName,
                        data: item.data
                    });
                });
            } else {
                selected.generic[0].data.push({
                    id: item.id,
                    itemName: item.itemName,
                    data: item.data
                });
            }
        });

        selected.grouped = Object.values(selected.grouped);

        this.reportSelected.component.submitted = {...selected};

        this.initCheckboxData();
        this.exportComponent();
    }

    ngOnInit() {
        if ((this.reportName !== 'custom' && !this.reportId) || !Object.keys(this.reportSelected.component).length) {
            this.initComponentData();
        }
        if (this.reportSelected.component.status === 'edit') {
            this.initCheckboxData();
        }

        this.reportSelected.component.resultsData = this.resultsData;

        this.subs = this.dataExchangeService.resultsData.subscribe((results) => {
            this.resultsData = {...results};
            delete this.resultsData.filters;
            this.filtersSelected = results.filters;

            this.reportSelected.component.resultsData = this.resultsData;
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }

}
