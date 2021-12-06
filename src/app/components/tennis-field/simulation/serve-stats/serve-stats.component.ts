import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-serve-stats',
    templateUrl: './serve-stats.component.html',
    styleUrls: ['./serve-stats.component.scss']
})
export class ServeStatsComponent implements OnInit {

    // INIT DATA
    filters;
    simulationFiltersHistory;
    fullScreen: boolean;

    // INIT SELECTED DATA
    statsSelected;

    @Input() filtersSelected: any;
    @Input() resultsData: any;
    @Input() side: any;
    @Output() statsSelectedEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private smartdataService: SmartdataService,
        private dataExchangeService: DataExchangeService,
    ) {}

    // INIT DATA
    initFieldData(type) {

        if (!this.filters) {
            this.filters = {
                common: [],
            };
        }

        if (type === 'common' || type === 'all') {
            this.filters.common = this.getSmartdataFilters('common');
        }
    }

    initSimulationFiltersHistoryData() {
        this.simulationFiltersHistory = [];
    }

    // INIT SELECTED DATA
    initSelectedStatsData() {
        this.statsSelected = {
            side: this.side,
            ace: 0,
            '1st': {
                itemName: '1st Serve Won',
                points: 0,
                counts: 0,
                fault: 0,
            },
            '2nd': {
                itemName: '2nd Serve Won',
                points: 0,
                counts: 0,
                fault: 0
            }
        };
        this.statsSelectedEmit.emit(this.statsSelected);
    }

    // GET DATA
    getSmartdataFilters(type) {
        if (type === 'common') {
            return this.smartdataService.getSmartdataFiltersCommon();
        }
    }

    // INIT EVENT
    updateSelectedStatsData() {

        // tslint:disable-next-line:variable-name
        const serve_side = this.generalService.findIntoArrayofObject(this.side, this.generalService.findIntoArrayofObject('serve_side', this.filters.common, 'id').values, 'id');

        this.initSelectedStatsData();

        const results = this.resultsData.smartdata[this.filtersSelected.smartdata.type[0].id].filter((smartdata) => {
            return String(smartdata.server) === String(this.filtersSelected.player.player_1[0].id) && smartdata.serve_side === serve_side.itemName && smartdata.serve_type !== 'na' && smartdata.serve_outcome !== 'na';
        });

        results.forEach((smartdata) => {
            if (smartdata.serve_outcome === 'ACE') {
                this.statsSelected.ace += smartdata.counts;
            } else {
                this.statsSelected[smartdata.serve_type].counts += smartdata.counts;
                if (smartdata.serve_outcome === 'IN' && smartdata.winner.ref_player.length) {
                    this.statsSelected[smartdata.serve_type].points += smartdata.winner.ref_player[0].counts;
                }
                if (smartdata.serve_outcome === 'FAULT') {
                    this.statsSelected[smartdata.serve_type].fault += smartdata.counts;
                }
            }
        });

        this.statsSelectedEmit.emit(this.statsSelected);
    }

    ngOnInit(): void {

        if (!this.filters) {
            this.initFieldData('all');
        }
        if (!this.simulationFiltersHistory) {
            this.initSimulationFiltersHistoryData();
        }

        this.dataExchangeService.resultsData.subscribe((results) => {

            this.resultsData = {...results};
            delete this.resultsData.filters;

            this.filtersSelected = results.filters;

            if (this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length &&
                this.filtersSelected.smartdata.type.length && this.resultsData.smartdata[this.filtersSelected.smartdata.type[0].id]) {
                this.updateSelectedStatsData();
            } else {
                this.initSelectedStatsData();
            }
        });

        this.dataExchangeService.simulationFiltersHistory.subscribe((history) => {

            this.initSimulationFiltersHistoryData();

            history.forEach((item) => {
                if (item.side === this.side || item.side === '') {

                    const common = this.generalService.findIntoArrayofObject(item.field, this.filters.common, 'id');

                    let exist = -1;

                    this.simulationFiltersHistory.forEach((subitem, i) => {
                        if (subitem.field === item.field) {
                            exist = i;
                        }
                    });

                    if (exist === -1) {
                        this.simulationFiltersHistory.push({
                            itemName: common.itemName.replace('Serve', 'S.').replace('Return', 'R.'),
                            field: item.field,
                            value: []
                        });
                        exist = this.simulationFiltersHistory.length - 1;
                    }

                    this.simulationFiltersHistory[exist].value.push({
                        id: item.value,
                        itemName: this.generalService.findIntoArrayofObject(item.value, common.values, 'id').itemName.replace('backhand return', 'BH').replace('forehand return', 'FH')
                    });
                }
            });
        });

        this.dataExchangeService.fullScreen.subscribe(val => {
            this.fullScreen = val;
        });
    }
}
