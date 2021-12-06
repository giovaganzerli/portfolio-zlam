import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as moment from 'moment';

import {MatchInfoComponent} from './templates/match-info/match-info.component';

// SERVICES
import {GeneralService} from '../../services/general/general.service';
import {ReportService} from '../../services/report/report.service';
import {DataExchangeService} from '../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnChanges {

    @Input() addSection: boolean;

    // INIT DATA
    report;
    resultsData;
    checkbox;

    // INIT SELECTED DATA
    builderSelected;
    reportSelected;
    filtersSelected;

    constructor(
        public generalService: GeneralService,
        private reportService: ReportService,
        private dataExchangeService: DataExchangeService,
        private matchInfoComponent: MatchInfoComponent
    ) {
    }

    // INIT DATA
    initReportData() {
        this.report = this.getReportTypes();
    }

    initCheckboxData() {
        this.checkbox = {
            type: false,
            subtype: false
        };
    }

    // INIT SELECTED DATA
    initSelectedReportData(type) {

        // NB: Costruisco già il report se viene selezionato basic, alert o kpis
        if (type === 'basic') {

            this.reportSelected[0].data.basic.rows = [
                {
                    type: {id: 'match_info'},
                    subtype: false,
                    settings: {},
                    component: {},
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'serve_performance',
                        rows: [
                            'aces',
                            'double_faults',
                            'first_serve_won',
                            'second_serve_won',
                            'break_points_saved',
                            'service_games_played'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'return_performance',
                        rows: [
                            'first_return_won',
                            'second_return_won',
                            'break_points_converted',
                            'return_games_played'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'points',
                        rows: [
                            'service_total_points_won',
                            'return_total_points_won',
                            'total_points_won'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                }
            ];

        } else if (type === 'alert') {

            this.reportSelected[0].data.alert.rows = [
                {
                    type: {id: 'match_info'},
                    subtype: false,
                    settings: {},
                    component: {},
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'rally_length',
                        rows: [
                            '0_4_shots_won',
                            '5_8_shots_won',
                            '9_more_shots_won',
                            '0_4_shots_played',
                            '5_8_shots_played',
                            '9_more_shots_played',
                            'total_played'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: true
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'serve_performance',
                        rows: [
                            'first_serve_in',
                            'first_serve_won',
                            'first_serve_unreturned',
                            'first_serve_aces',
                            'second_serve_in',
                            'second_serve_won',
                            'second_serve_unreturned',
                            'second_serve_aces'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: true
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'winners',
                        rows: [
                            'fh_return',
                            'bh_return',
                            'forehand',
                            'backhand',
                            'serve',
                            'net',
                            'total_winners'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'errors',
                        rows: [
                            'fh_return',
                            'bh_return',
                            'forehand',
                            'backhand',
                            'serve',
                            'net',
                            'total_winners'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'baseline_points',
                        rows: [
                            'baseline_points_won_anywhere',
                            'baseline_points_won_both'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'return_performance',
                        rows: [
                            'fh_winners',
                            'fh_errors',
                            'bh_winners',
                            'bh_errors',
                            'total_errors'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'net_points',
                        rows: [
                            'approach',
                            'serve_volley',
                            'combined_total'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'break_points',
                        rows: [
                            'saved',
                            'converted',
                            'combined_total'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: false
                    },
                    component: {}
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'first_point_won',
                        rows: [
                            'won_first_point_game',
                            'lost_first_point_game',
                            'win_perc_first_point_game',
                            'game_won_first_point_won',
                            'game_lost_first_point_won',
                            'win_perc_first_point_won',
                            'game_won_first_point_lost',
                            'game_lost_first_point_lost',
                            'win_perc_first_point_lost'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: true
                    },
                    component: {}
                }
            ];

        } else if (type === 'kpis') {

            this.reportSelected[0].data.kpis.rows = [
                {
                    type: {id: 'match_info'},
                    subtype: false,
                    settings: {},
                    component: {},
                },
                {
                    type: {id: 'general_stats'},
                    subtype: {
                        id: 'kpi',
                        rows: [
                            'points_won_on_first_strike_0_4',
                            'points_won_first_serve_return',
                            'points_won_with_first_serve',
                            'points_won_from_baseline',
                            'forced_errors',
                            'points_won_with_second_serve_return',
                            'points_won_with_second_serve',
                            'break_point_perc',
                            'unforced_errors',
                            'points_won_on_long_rallies_up_9',
                            'points_won_on_long_rallies_bw_5_8',
                            'winners',
                            'net_points_won',
                            'ace',
                            'bouble_faults',
                            'first_serve_perc',
                            'avarange_speed_first_serve'
                        ]
                    },
                    settings: {
                        grouped_subtype_rows: true
                    },
                    component: {}
                }
            ];

        } else if (type === 'custom') {

            this.reportSelected[0].data.custom.rows = [];
        }
    }

    initSelectedBuilderData() {
        this.builderSelected = {
            add: false,
            type: {},
            subtype: {}
        };
    }

    toggleAddSection() {
        this.builderSelected.add = !this.builderSelected.add;
    }

    // GET DATA
    getReportTypes() {
        return this.reportService.getReportTypes();
    }

    // INIT EVENT
    onTypeSelect(type) {

        this.builderSelected.type = {...type};
        delete this.builderSelected.type.subtype;

        this.checkbox.type = type.id;
        this.checkbox.subtype = false;

        if (!type.subtype.length) {

            this.onSectionAdd();

        } else {

            this.checkbox.subtype = type.subtype[0].id;
            this.onSubTypeSelect(type.subtype[0]);
        }
    }

    onSubTypeSelect(subtype) {
        this.builderSelected.subtype = subtype;
    }

    onSectionAdd() {
        this.reportSelected[0].data[this.reportSelected[0].type].rows.push({
            id: moment().unix(),
            type: this.builderSelected.type,
            subtype: this.builderSelected.subtype,
            settings: {},
            component: {}
        });

        this.initCheckboxData();
        this.initSelectedBuilderData();
    }

    onSectionRemove(index) {
        this.reportSelected[0].data[this.reportSelected[0].type].rows.splice(index, 1);
        this.dataExchangeService.setSelectedReportData(this.reportSelected);
    }

    editComponent(index) {
        this.reportSelected[0].data[this.reportSelected[0].type].rows[index].component.status = 'edit';
    }

    onCancel() {
        this.initCheckboxData();
        this.initSelectedBuilderData();
    }

    onNoteMoveEnd(event, index) {
        this.reportSelected[0].data[this.reportSelected[0].type].notes[index].coords = event;
    }

    onNoteResizeEnd(event, index) {
        this.reportSelected[0].data[this.reportSelected[0].type].notes[index].size = event.size;
    }

    onNoteColorChange(color, index) {
        this.reportSelected[0].data[this.reportSelected[0].type].notes[index].color = color;
    }

    onNoteDescriptionChange(event, index) {
        this.reportSelected[0].data[this.reportSelected[0].type].notes[index].description = event.target.value;
    }

    onNoteRemove(index) {
        this.reportSelected[0].data[this.reportSelected[0].type].notes.splice(index, 1);
    }

    // Info: funzione per aggiornare il componente del report, viene chiamata dall'event emitter del child
    // il parametro 'component' è l'$event passato dal child
    updateReportComponent(index, component) {
        this.reportSelected[0].data[this.reportSelected[0].type].rows[index].component = component;
        this.dataExchangeService.setSelectedReportData(this.reportSelected);
    }

    ngOnInit(): void {
        if (!this.report) {
            this.initReportData();
        }

        this.initCheckboxData();
        this.initSelectedBuilderData();

        this.dataExchangeService.reportSelected.subscribe((report) => {
            this.reportSelected = [...report];
        });

        this.dataExchangeService.resultsData.subscribe((results) => {

            this.resultsData = {...results};
            delete this.resultsData.filters;

            this.filtersSelected = results.filters;

            if (!this.reportSelected[0].id && this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length && this.reportSelected[0].type !== 'custom') {
                this.initSelectedReportData(this.reportSelected[0].type);
            }
        });

        this.dataExchangeService.dataDataview.subscribe((hightlights) => {
            if (hightlights.length) {
                this.onTypeSelect(this.generalService.findIntoArrayofObject('highlights', this.report, 'id'));
            }
        });

        this.dataExchangeService.dataSimulation.subscribe((simulation) => {
            if (simulation.type) {
                this.onTypeSelect(this.generalService.findIntoArrayofObject(simulation.type, this.report, 'id'));
            }
        });
    }

    ngOnChanges(changes) {
        // console.log(changes);
        if (changes.hasOwnProperty('addSection') && changes.addSection.currentValue) {
            this.builderSelected.add = true;
        }
    }

}
