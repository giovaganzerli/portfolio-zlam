import {Component, Input, OnChanges, OnInit} from '@angular/core';

// SERVICES
import { GeneralService } from '../../../services/general/general.service';
import { DatasetService } from '../../../services/dataset/dataset.service';
import { DataExchangeService } from '../../../services/data-exchange/data-exchange.service';
import { SmartdataService } from '../../../services/smartdata/smartdata.service';

@Component({
    selector: 'app-data-view',
    templateUrl: './data-view.component.html',
    styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {

    // INIT DATA
    dataset;
    highlightsData;
    report;

    // INIT SELECTED DATA
    highlightsSelected;
    modeSelected;

    separatore;
    fullScreen: boolean;

    @Input() filtersSelected: any;
    @Input() datasetSelected: any;
    @Input() resultsData: any;

    constructor(
        public generalService: GeneralService,
        private datasetService: DatasetService,
        private dataExchangeService: DataExchangeService,
        private smartdataService: SmartdataService
    ) { }

    // INIT DATA

    initDatasetData(callback) {
        this.getDatasets().subscribe((response) => {
            // @ts-ignore
            this.dataset = response.data;
            if (callback) {
                callback();
            }
        });
    }

    initHighlightsData() {
        this.highlightsData = [];
        if (this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length && this.filtersSelected.smartdata.type.length && this.resultsData && this.resultsData.smartdata) {
            Object.keys(this.resultsData.smartdata).forEach((key, i) => {
                const smartdataType = this.generalService.findIntoArrayofObject(key, this.smartdataService.getSmartdataTypes(), 'id');
                this.highlightsData = this.smartdataService.translateSmartdataToString(this.resultsData.smartdata[key], smartdataType, this.filtersSelected);
            });
        }
    }

    // INIT SELECTED DATA

    initSelectedHightlightsData() {
        this.highlightsSelected = [];
    }

    initModeSelectedData() {
        this.modeSelected = 'view';
    }

    // GET DATA

    getDatasets() {
        return this.datasetService.getDatasets();
    }

    // INIT HTML

    initDatasetHTML() {
        let str = '';
        if (this.datasetSelected.length === this.dataset.length) {
            str += '<span class="tag is-info">All datasets</span>';
        } else {
            this.datasetSelected.forEach((dataset, i) => {
                if (i > 0) {
                    str += this.separatore;
                }
                str += '<span class="tag is-info">' + dataset.itemName + '</span>';
            });
        }
        return str;
    }

    initFiltersHTML() {
        let str = '';
        if (this.filtersSelected.player.player_1.length > 0) {
            str += '<span class="tag blue">' + this.filtersSelected.player.player_1[0].itemName + '</span>';
            str += this.separatore + '<span class="tag is-black">Serving to</span>';

            if (this.filtersSelected.player.against_all && this.filtersSelected.player.player_2.length > 1) {
                str += this.separatore + '<span class="tag purple">All opponents</span>';
            } else if (!this.filtersSelected.player.against_all && this.filtersSelected.player.player_2.length > 1) {
                str += this.separatore + '<span class="tag purple">' + this.filtersSelected.player.player_2.length + ' opponents</span>';
            } else {
                str += this.separatore;
                this.filtersSelected.player.player_2.forEach((player) => {
                    str += '<span class="tag purple">' + player.itemName + '</span>';
                });
            }

            Object.keys(this.filtersSelected.common).forEach((common) => {
                if (this.filtersSelected.common[common].values.length) {
                    str += this.separatore + '<span class="tag is-black">' + this.filtersSelected.common[common].itemName + ':</span>';
                    this.filtersSelected.common[common].values.forEach((option) => {
                        str += '<span class="tag is-info">' + option.itemName + '</span>';
                    });
                }
            });
        }

        return str;
    }

    // INIT EVENT

    onHighlightSelect(highlight) {
        if (this.modeSelected === 'select') {
            if (this.generalService.findIntoArrayofObject(highlight.description, this.highlightsSelected, 'description')) {
                // tslint:disable-next-line:max-line-length
                this.highlightsSelected = this.generalService.removeObjectFromArray(highlight.description, this.highlightsSelected, 'description');
            } else {
                this.highlightsSelected.push(highlight);
            }
        }
    }

    onModeChange() {
        this.modeSelected = (this.modeSelected === 'select') ? 'view' : 'select';
    }

    addToReport() {
        this.report[0].type = 'custom';
        setTimeout(() => {
            this.dataExchangeService.setDataviewData(this.highlightsSelected);
            // NB: Svuoto la selezione
            this.initSelectedHightlightsData();
        }, 300);
    }

    ngOnInit(): void {

        this.initModeSelectedData();

        this.initDatasetData(() => {
            this.initHighlightsData();
            this.initSelectedHightlightsData();
            this.separatore = '<span class="tag is-black">+</span>';
        });

        this.dataExchangeService.reportSelected.subscribe((report) => {
            this.report = [...report];
        });

        this.dataExchangeService.resultsData.subscribe((results) => {
            this.resultsData = {...results};
            delete this.resultsData.filters;

            this.filtersSelected = results.filters;

            this.initSelectedHightlightsData();
            this.initHighlightsData();
        });

        this.dataExchangeService.fullScreen.subscribe(val => {
            this.fullScreen = val;
        });
    }

}
