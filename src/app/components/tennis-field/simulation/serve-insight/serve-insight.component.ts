import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output, SimpleChanges, ViewChild} from '@angular/core';

import { Subscription } from 'rxjs';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { FiltersService } from '../../../../services/filters/filters.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-serve-insight',
    templateUrl: './serve-insight.component.html',
    styleUrls: ['./serve-insight.component.scss']
})
export class ServeInsightComponent implements OnInit, OnChanges, OnDestroy {

    @ViewChild('tennisFieldInsightGraphBars') tennisFieldInsightGraphBars: ElementRef;
    @ViewChild('tennisFieldInsightShotPlacement') tennisFieldInsightShotPlacement: ElementRef;

    // INIT DATA
    dataInsight;

    // INIT SUBSCRIPTION
    private subscriptionReport: Subscription;

    @Input() report: any;
    @Input() filtersSelected: any;
    @Input() insightSelected: any;
    @Input() modeSelected: any;
    @Input() resultsData: any;
    @Output() insightEmit = new EventEmitter<any>();
    @Output() modeSelectedEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private filtersService: FiltersService,
        private smartdataService: SmartdataService,
        private dataExchangeService: DataExchangeService
    ) { }

    // INIT DATA
    initInsightData() {
        this.dataInsight = {
            common: this.smartdataService.getSmartdataFiltersCommon()
        };
    }

    // INIT SELECTED DATA
    initSelectedInsightData(type = 'all') {

        if (type === 'data' || type === 'all') {
            this.insightSelected.data = {
                serve_placement: {
                    s1: {
                        points: 0,
                        counts: 0
                    },
                    s2: {
                        points: 0,
                        counts: 0
                    },
                    s3: {
                        points: 0,
                        counts: 0
                    },
                    s4: {
                        points: 0,
                        counts: 0
                    },
                    s5: {
                        points: 0,
                        counts: 0
                    },
                    s6: {
                        points: 0,
                        counts: 0
                    },
                    s7: {
                        points: 0,
                        counts: 0
                    },
                    s8: {
                        points: 0,
                        counts: 0
                    }
                },
                return_contact_depth: {
                    z1: {
                        points: 0,
                        counts: 0
                    },
                    z2: {
                        points: 0,
                        counts: 0
                    },
                    z3: {
                        points: 0,
                        counts: 0
                    },
                    z4: {
                        points: 0,
                        counts: 0
                    },
                    z5: {
                        points: 0,
                        counts: 0
                    }
                },
                return_contact: {
                    a: {
                        points: 0,
                        counts: 0
                    },
                    b: {
                        points: 0,
                        counts: 0
                    },
                    c: {
                        points: 0,
                        counts: 0
                    },
                    d: {
                        points: 0,
                        counts: 0
                    }
                }
            };
        }

        if (type === 'settings' || type === 'all') {
            if (this.insightSelected.view.id === 'graph_bars') {
                this.insightSelected.settings = {
                    perc_distribution: 'zone'
                };
            }
        }
    }

    // GET DATA
    // tslint:disable-next-line:max-line-length
    getMatches(filters = this.filtersSelected) {
        return this.filtersService.getMatches(this.resultsData.match.map(value => value.id), [], filters, 0);
    }

    // INIT EVENT
    updateSelectedInsightGraphBarsData() {

        // tslint:disable-next-line:variable-name
        const serve_placement = this.generalService.findIntoArrayofObject('serve_placement', this.dataInsight.common, 'id');
        // tslint:disable-next-line:variable-name
        const return_contact_depth = this.generalService.findIntoArrayofObject('return_contact_depth', this.dataInsight.common, 'id');
        // tslint:disable-next-line:variable-name
        const return_contact = this.generalService.findIntoArrayofObject('return_contact', this.dataInsight.common, 'id');

        const filters = {...this.filtersSelected};

        this.initSelectedInsightData('data');

        filters.field = {
            ad: {},
            deuce: {}
        };

        filters.smartdata.columns = [
            'server',
            'serve_type',
            'serve_outcome',
            'serve_side',
            'serve_placement',
            'return_contact',
            'return_contact_depth',
        ];

        if (this.insightSelected.type.id === 'serve_placement') {

            if (this.insightSelected.side[0] === 'ad') {
                filters.field.ad.serve_placement = serve_placement;
                filters.field.ad.serve_placement.values = this.generalService.findIntoArrayofObject(['s5', 's6', 's7', 's8'], serve_placement.values, 'id');
            } else if (this.insightSelected.side[0] === 'deuce') {
                filters.field.deuce.serve_placement = serve_placement;
                filters.field.deuce.serve_placement.values = this.generalService.findIntoArrayofObject(['s1', 's2', 's3', 's4'], serve_placement.values, 'id');
            }

        } else if (this.insightSelected.type.id === 'return_contact_depth') {

            filters.field.ad.return_contact_depth = return_contact_depth;
            filters.field.ad.return_contact_depth.values = this.generalService.findIntoArrayofObject(['z1', 'z2', 'z3', 'z4', 'z5'], return_contact_depth.values, 'id');
            filters.field.deuce.return_contact_depth = return_contact_depth;
            filters.field.deuce.return_contact_depth.values = this.generalService.findIntoArrayofObject(['z1', 'z2', 'z3', 'z4', 'z5'], return_contact_depth.values, 'id');

        } else if (this.insightSelected.type.id === 'return_contact') {

            filters.field.ad.return_contact = return_contact;
            filters.field.ad.return_contact.values = this.generalService.findIntoArrayofObject(['a', 'b', 'c', 'd'], return_contact.values, 'id');
            filters.field.deuce.return_contact = return_contact;
            filters.field.deuce.return_contact.values = this.generalService.findIntoArrayofObject(['a', 'b', 'c', 'd'], return_contact.values, 'id');
        }

        this.getMatches(filters).subscribe((results) => {

            // tslint:disable-next-line:variable-name
            results.data.smartdata['override'].forEach((smartdata) => {

                if (this.insightSelected.settings.perc_distribution === 'zone') {

                    if (smartdata.hasOwnProperty('serve_placement') && this.insightSelected.data.serve_placement.hasOwnProperty(smartdata.serve_placement.toLowerCase())) {
                        this.insightSelected.data.serve_placement[smartdata.serve_placement.toLowerCase()].counts += smartdata.counts;
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.serve_placement[smartdata.serve_placement.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }
                    if (smartdata.hasOwnProperty('return_contact_depth') && this.insightSelected.data.return_contact_depth.hasOwnProperty(smartdata.return_contact_depth.toLowerCase())) {
                        this.insightSelected.data.return_contact_depth[smartdata.return_contact_depth.toLowerCase()].counts += smartdata.counts;
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.return_contact_depth[smartdata.return_contact_depth.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }
                    if (smartdata.hasOwnProperty('return_contact') && this.insightSelected.data.return_contact.hasOwnProperty(smartdata.return_contact.toLowerCase())) {
                        this.insightSelected.data.return_contact[smartdata.return_contact.toLowerCase()].counts += smartdata.counts;
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.return_contact[smartdata.return_contact.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }

                } else if (this.insightSelected.settings.perc_distribution === 'area') {

                    if (smartdata.hasOwnProperty('serve_placement') && this.insightSelected.data.serve_placement.hasOwnProperty(smartdata.serve_placement.toLowerCase())) {
                        if (this.insightSelected.side[0] === 'ad' && (['s5', 's6', 's7', 's8'].indexOf(smartdata.serve_placement.toLowerCase()) !== -1)) {
                            this.insightSelected.data.serve_placement.s5.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s6.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s7.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s8.counts += smartdata.counts;
                        } else if (this.insightSelected.side[0] === 'deuce' && (['s1', 's2', 's3', 's4'].indexOf(smartdata.serve_placement.toLowerCase()) !== -1)) {
                            this.insightSelected.data.serve_placement.s1.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s2.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s3.counts += smartdata.counts;
                            this.insightSelected.data.serve_placement.s4.counts += smartdata.counts;
                        }
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.serve_placement[smartdata.serve_placement.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }
                    if (smartdata.hasOwnProperty('return_contact_depth') && this.insightSelected.data.return_contact_depth.hasOwnProperty(smartdata.return_contact_depth.toLowerCase())) {
                        if (['z1', 'z2', 'z3', 'z4', 'z5'].indexOf(smartdata.return_contact_depth.toLowerCase()) !== -1) {
                            this.insightSelected.data.return_contact_depth.z1.counts += smartdata.counts;
                            this.insightSelected.data.return_contact_depth.z2.counts += smartdata.counts;
                            this.insightSelected.data.return_contact_depth.z3.counts += smartdata.counts;
                            this.insightSelected.data.return_contact_depth.z4.counts += smartdata.counts;
                            this.insightSelected.data.return_contact_depth.z5.counts += smartdata.counts;
                        }
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.return_contact_depth[smartdata.return_contact_depth.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }
                    if (smartdata.hasOwnProperty('return_contact') && this.insightSelected.data.return_contact.hasOwnProperty(smartdata.return_contact.toLowerCase())) {
                        if (['a', 'b', 'c', 'd'].indexOf(smartdata.return_contact.toLowerCase()) !== -1) {
                            this.insightSelected.data.return_contact.a.counts += smartdata.counts;
                            this.insightSelected.data.return_contact.b.counts += smartdata.counts;
                            this.insightSelected.data.return_contact.c.counts += smartdata.counts;
                            this.insightSelected.data.return_contact.d.counts += smartdata.counts;
                        }
                        if (this.generalService.findIntoArrayofObject(smartdata.serve_outcome.toLowerCase(), filters.common.serve_outcome.values, 'id') && smartdata.winner.ref_player.length) {
                            this.insightSelected.data.return_contact[smartdata.return_contact.toLowerCase()].points += smartdata.winner.ref_player[0].counts;
                        }
                    }
                }
            });
        });

        delete filters.smartdata.columns;
    }

    addToReport() {

        const simulationData = {
            type: 'insight',
            elements: {},
            data: {}
        };

        if (simulationData.type === 'insight') {

            simulationData.elements = {
                insight: {
                    graph_bars: this.tennisFieldInsightGraphBars.nativeElement.innerHTML,
                    shot_placement: this.tennisFieldInsightShotPlacement.nativeElement.innerHTML
                }
            };

            simulationData.data = {...this.insightSelected};
        }

        this.report[0].type = 'custom';
        setTimeout(() => {
            this.dataExchangeService.setSimulationData(simulationData);
            this.modeSelectedEmit.emit();
        }, 300);
    }

    onSettingRadioChange(field, value) {
        this.insightSelected.settings[field] = value;
        this.updateSelectedInsightGraphBarsData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('modeSelected') && changes.modeSelected.currentValue === 'select') {
            if (this.insightSelected.type.id) {
                this.addToReport();
            }
        }
    }

    ngOnInit(): void {

        let isInit = true;

        if (!this.dataInsight) {
            this.initInsightData();
        }

        this.initSelectedInsightData();

        this.subscriptionReport = this.dataExchangeService.resultsData.subscribe((results) => {

            this.resultsData = {...results};
            delete this.resultsData.filters;

            this.filtersSelected = results.filters;

            if (this.filtersSelected.common.serve_side.values.length) {

                if (!isInit) {
                    this.insightSelected.side = [this.filtersSelected.common.serve_side.values[0].id];
                }

                if (this.insightSelected.view.id === 'graph_bars' && this.insightSelected.data) {
                    this.updateSelectedInsightGraphBarsData();
                }

            } else {

                this.insightSelected.side = [];
                this.insightEmit.emit();
            }

            isInit = false;
        });
    }

    ngOnDestroy() {
        this.subscriptionReport.unsubscribe();
    }
}
