import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

import * as moment from 'moment';
import {map} from 'rxjs/operators';

// SERVICES
import {AuthService} from '../auth/auth.service';
import {GeneralService} from '../general/general.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private generalService: GeneralService
    ) {
    }

    getReportTypes() {
        const reportType = [
            {
                id: 'match_info',
                itemName: 'Report cover',
                description: '',
                required: ['match'],
                subtype: []
            },
            {
                id: 'general_stats',
                itemName: 'General stats',
                description: 'Select stats to include',
                required: ['match'],
                subtype: [
                    {
                        id: 'serve_performance',
                        itemName: 'Serve perforance',
                        description: ''
                    },
                    {
                        id: 'return_performance',
                        itemName: 'Return perforance',
                        description: ''
                    },
                    {
                        id: 'points',
                        itemName: 'Points',
                        description: ''
                    },
                    {
                        id: 'kpi',
                        itemName: 'KPI',
                        description: ''
                    },
                    {
                        id: 'rally_length',
                        itemName: 'Rally Length',
                        description: ''
                    },
                    {
                        id: 'winners',
                        itemName: 'Winners',
                        description: ''
                    },
                    {
                        id: 'errors',
                        itemName: 'Errors',
                        description: ''
                    },
                    {
                        id: 'baseline_points',
                        itemName: 'Baseline points',
                        description: ''
                    },
                    {
                        id: 'net_points',
                        itemName: 'Net points',
                        description: ''
                    },
                    {
                        id: 'break_points',
                        itemName: 'Break points',
                        description: ''
                    },
                    {
                        id: '1st_point_won',
                        itemName: '1st point won',
                        description: ''
                    }
                ]
            },
            {
                id: 'summary',
                itemName: 'Summary',
                description: '',
                required: ['match'],
                subtype: []
            },
            {
                id: 'text_block',
                itemName: 'Text block',
                description: '',
                required: ['match'],
                subtype: []
            },
            {
                id: 'highlights',
                itemName: 'Highlights',
                description: '',
                required: ['match', 'smartdata'],
                subtype: []
            },
            {
                id: 'smartdata',
                itemName: 'Smart Data',
                description: '',
                required: ['match', 'smartdata'],
                subtype: []
            },
            {
                id: 'insight',
                itemName: 'Insight',
                description: '',
                required: ['match'],
                subtype: []
            },
            {
                id: 'video_gallery',
                itemName: 'Video gallery',
                description: '',
                required: ['match'],
                subtype: []
            },
            {
                id: 'pictures',
                itemName: 'Match Pictures',
                description: '',
                required: ['match'],
                subtype: []
            }
        ];
        return reportType;
    }

    getReportTypeRows(type) {
        let reportRows = [];

        if (type === 'serve_performance') {
            reportRows = [
                {
                    id: 'aces',
                    itemName: 'Aces',
                    description: '',
                    group: []
                },
                {
                    id: 'double_faults',
                    itemName: 'Double Faults',
                    description: '',
                    group: []
                },
                {
                    id: 'break_points_saved',
                    itemName: 'Breaks points Saved',
                    description: '',
                    group: []
                },
                {
                    id: 'service_games_played',
                    itemName: 'Service games played',
                    description: '',
                    group: []
                },
                {
                    id: 'first_serve_in',
                    itemName: '1st serve in',
                    description: '',
                    group: [
                        {
                            id: 'first_serve_performance',
                            itemName: '1st serve performance'
                        }
                    ]
                },
                {
                    id: 'first_serve_won',
                    itemName: '1st serve won',
                    description: '',
                    group: [
                        {
                            id: 'first_serve_performance',
                            itemName: '1st serve performance'
                        }
                    ]
                },
                {
                    id: 'first_serve_lost',
                    itemName: '1st serve lost',
                    description: '',
                    group: [
                        {
                            id: 'first_serve_performance',
                            itemName: '1st serve performance'
                        }
                    ]
                },
                {
                    id: 'first_serve_aces',
                    itemName: '1st serve aces',
                    description: '',
                    group: [
                        {
                            id: 'first_serve_performance',
                            itemName: '1st serve performance'
                        }
                    ]
                },
                {
                    id: 'second_serve_in',
                    itemName: '2nd serve in',
                    description: '',
                    group: [
                        {
                            id: 'second_serve_performance',
                            itemName: '2nd serve performance'
                        }
                    ]
                },
                {
                    id: 'second_serve_won',
                    itemName: '2nd serve won',
                    description: '',
                    group: [
                        {
                            id: 'second_serve_performance',
                            itemName: '2nd serve performance'
                        }
                    ]
                },
                {
                    id: 'second_serve_lost',
                    itemName: '2nd serve lost',
                    description: '',
                    group: [
                        {
                            id: 'second_serve_performance',
                            itemName: '2nd serve performance'
                        }
                    ]
                },
                {
                    id: 'second_serve_aces',
                    itemName: '2nd serve aces',
                    description: '',
                    group: [
                        {
                            id: 'second_serve_performance',
                            itemName: '2nd serve performance'
                        }
                    ]
                }
            ];
        } else if (type === 'return_performance') {
            reportRows = [
                {
                    id: 'return_games_played',
                    itemName: 'Return games played',
                    description: '',
                    group: []
                },
                {
                    id: 'first_return_in',
                    itemName: '1st Return Points In',
                    description: '',
                    group: []
                },
                {
                    id: 'first_return_won',
                    itemName: '1st Return Points Won',
                    description: '',
                    group: []
                },
                {
                    id: 'first_return_lost',
                    itemName: '1st Return Points Lost',
                    description: '',
                    group: []
                },
                {
                    id: 'second_return_in',
                    itemName: '2nd Return Points In',
                    description: '',
                    group: []
                },
                {
                    id: 'second_return_won',
                    itemName: '2nd Return Points Won',
                    description: '',
                    group: []
                },
                {
                    id: 'second_return_lost',
                    itemName: '2nd Return Points Lost',
                    description: '',
                    group: []
                },
                {
                    id: 'break_points_won',
                    itemName: 'Break Points Won',
                    description: '',
                    group: []
                },
                {
                    id: 'break_points_converted',
                    itemName: 'Break Points Converted',
                    description: '',
                    group: []
                },
                {
                    id: 'fh_winners',
                    itemName: 'FH Winners',
                    description: '',
                    group: []
                },
                {
                    id: 'fh_errors',
                    itemName: 'FH Errors',
                    description: '',
                    group: []
                },
                {
                    id: 'bh_winners',
                    itemName: 'BH Winners',
                    description: '',
                    group: []
                },
                {
                    id: 'bh_errors',
                    itemName: 'BH Errors',
                    description: '',
                    group: []
                },
                {
                    id: 'total_errors',
                    itemName: 'Total Errors',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'points') {
            reportRows = [
                {
                    id: 'service_total_points_won',
                    itemName: 'Service total points won',
                    description: '',
                    group: []
                },
                {
                    id: 'return_total_points_won',
                    itemName: 'Return total points won',
                    description: '',
                    group: []
                },
                {
                    id: 'total_points_won',
                    itemName: 'Total points won',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'kpi') {
            reportRows = [
                {
                    id: 'points_won_on_first_strike_0_4',
                    itemName: 'Points won on first strike 0-4',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_first_serve_return',
                    itemName: ' Points won with 1st Serve return',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_with_first_serve',
                    itemName: 'Points won with 1st Serve',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_from_baseline',
                    itemName: 'Points won from Baseline',
                    description: '',
                    group: []
                },
                {
                    id: 'forced_errors',
                    itemName: 'Forced errors',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_with_second_serve_return',
                    itemName: 'Points won with 2nd Serve return',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_with_second_serve',
                    itemName: 'Points won with 2nd Serve',
                    description: '',
                    group: []
                },
                {
                    id: 'break_point_perc',
                    itemName: 'Break point %',
                    description: '',
                    group: []
                },
                {
                    id: 'unforced_errors',
                    itemName: 'Unforced errors',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_on_long_rallies_up_9',
                    itemName: 'Points won on long rallies (> 9)',
                    description: '',
                    group: []
                },
                {
                    id: 'points_won_on_long_rallies_bw_5_8',
                    itemName: 'Points won on extended rallies (5-8)',
                    description: '',
                    group: []
                },
                {
                    id: 'winners',
                    itemName: 'Winners',
                    description: '',
                    group: []
                },
                {
                    id: 'net_points_won',
                    itemName: 'Net points won',
                    description: '',
                    group: []
                },
                {
                    id: 'ace',
                    itemName: 'Ace',
                    description: '',
                    group: []
                },
                {
                    id: 'bouble_faults',
                    itemName: 'Double faults',
                    description: '',
                    group: []
                },
                {
                    id: 'first_serve_perc',
                    itemName: '1st serve %',
                    description: '',
                    group: []
                },
                {
                    id: 'avarange_speed_first_serve',
                    itemName: 'Average speed 1st serve',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'rally_length') {
            reportRows = [
                {
                    id: '0_4_shots_won',
                    itemName: '0-4 shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_won',
                            itemName: 'Rally length won'
                        }
                    ]
                },
                {
                    id: '5_8_shots_won',
                    itemName: '5-8 shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_won',
                            itemName: 'Rally length won'
                        }
                    ]
                },
                {
                    id: '9_more_shots_won',
                    itemName: '9+ shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_won',
                            itemName: 'Rally length won'
                        }
                    ]
                },
                {
                    id: '0_4_shots_played',
                    itemName: '0-4 shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_played',
                            itemName: 'Rally length played'
                        }
                    ]
                },
                {
                    id: '5_8_shots_played',
                    itemName: '5-8 shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_played',
                            itemName: 'Rally length played'
                        }
                    ]
                },
                {
                    id: '9_more_shots_played',
                    itemName: '9+ shots',
                    description: '',
                    group: [
                        {
                            id: 'rally_length_played',
                            itemName: 'Rally length played'
                        }
                    ]
                },
                {
                    id: 'total_played',
                    itemName: 'Total',
                    group: [
                        {
                            id: 'rally_length_played',
                            itemName: 'Rally length played'
                        }
                    ]
                }
            ];
        } else if (type === 'winners') {
            reportRows = [
                {
                    id: 'fh_return',
                    itemName: 'FH Return',
                    description: '',
                    group: []
                },
                {
                    id: 'bh_return',
                    itemName: 'BH Return',
                    description: '',
                    group: []
                },
                {
                    id: 'forehand',
                    itemName: 'Forehand',
                    description: '',
                    group: []
                },
                {
                    id: 'backhand',
                    itemName: 'Backhand',
                    description: '',
                    group: []
                },
                {
                    id: 'serve',
                    itemName: 'Serve',
                    description: '',
                    group: []
                },
                {
                    id: 'net',
                    itemName: 'Net',
                    description: '',
                    group: []
                },
                {
                    id: 'total_winners',
                    itemName: 'Total winners',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'errors') {
            reportRows = [
                {
                    id: 'fh_return',
                    itemName: 'FH Return',
                    description: '',
                    group: []
                },
                {
                    id: 'bh_return',
                    itemName: 'BH Return',
                    description: '',
                    group: []
                },
                {
                    id: 'forehand',
                    itemName: 'Forehand',
                    description: '',
                    group: []
                },
                {
                    id: 'backhand',
                    itemName: 'Backhand',
                    description: '',
                    group: []
                },
                {
                    id: 'serve',
                    itemName: 'Serve',
                    description: '',
                    group: []
                },
                {
                    id: 'net',
                    itemName: 'Net',
                    description: '',
                    group: []
                },
                {
                    id: 'total_winners',
                    itemName: 'Total winners',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'baseline_points') {
            reportRows = [
                {
                    id: 'baseline_points_won_anywhere',
                    itemName: 'Baseline points Won',
                    description: '(opponent anywhere)',
                    group: []
                },
                {
                    id: 'baseline_points_won_both',
                    itemName: 'Baseline points Won',
                    description: '(both at baseline)',
                    group: []
                },
            ];
        } else if (type === 'net_points') {
            reportRows = [
                {
                    id: 'approach',
                    itemName: 'Approach',
                    description: '',
                    group: []
                },
                {
                    id: 'serve_volley',
                    itemName: 'Serve&Volley',
                    description: '',
                    group: []
                },
                {
                    id: 'combined_total',
                    itemName: 'Combined total',
                    description: '',
                    group: []
                }
            ];
        } else if (type === 'break_points') {
            reportRows = [
                {
                    id: 'saved',
                    itemName: 'Saved',
                    description: '',
                    group: []
                },
                {
                    id: 'converted',
                    itemName: 'Converted',
                    description: '',
                    group: []
                },
                {
                    id: 'combined_total',
                    itemName: 'Combined total',
                    description: '',
                    group: []
                }
            ];
        } else if (type === '1st_point_won') {
            reportRows = [
                {
                    id: 'won_first_point_game',
                    itemName: 'Won',
                    description: '',
                    group: [
                        {
                            id: 'first_point_of_game',
                            itemName: '1st point of game'
                        }
                    ]
                },
                {
                    id: 'lost_first_point_game',
                    itemName: 'Lost',
                    description: '',
                    group: [
                        {
                            id: 'first_point_of_game',
                            itemName: '1st point of game'
                        }
                    ]
                },
                {
                    id: 'win_perc_first_point_game',
                    itemName: 'Win %',
                    description: '',
                    group: [
                        {
                            id: 'first_point_of_game',
                            itemName: '1st point of game'
                        }
                    ]
                },
                {
                    id: 'game_won_first_point_won',
                    itemName: 'Game won',
                    description: '',
                    group: [
                        {
                            id: 'first_point_won',
                            itemName: '1st point won'
                        }
                    ]
                },
                {
                    id: 'game_lost_first_point_won',
                    itemName: 'Game lost',
                    description: '',
                    group: [
                        {
                            id: 'first_point_won',
                            itemName: '1st point won'
                        }
                    ]
                },
                {
                    id: 'win_perc_first_point_won',
                    itemName: 'Win %',
                    description: '',
                    group: [
                        {
                            id: 'first_point_won',
                            itemName: '1st point won'
                        }
                    ]
                },
                {
                    id: 'game_won_first_point_lost',
                    itemName: 'Game won',
                    description: '',
                    group: [
                        {
                            id: 'first_point_lost',
                            itemName: '1st point lost'
                        }
                    ]
                },
                {
                    id: 'game_lost_first_point_lost',
                    itemName: 'Game lost',
                    description: '',
                    group: [
                        {
                            id: 'first_point_lost',
                            itemName: '1st point lost'
                        }
                    ]
                },
                {
                    id: 'win_perc_first_point_lost',
                    itemName: 'Win %',
                    description: '',
                    group: [
                        {
                            id: 'first_point_lost',
                            itemName: '1st point lost'
                        }
                    ]
                },
            ];
        }

        return reportRows;
    }

    setReport(reportSelectedData) {

        const reports = (localStorage.getItem('reports')) ? JSON.parse(localStorage.getItem('reports')) : [];
        const report = {...reportSelectedData[0]};

        if (report.id !== 0) {
            // tslint:disable-next-line:variable-name
            reports.forEach((_report, i) => {
                if (_report.id === report.id) {
                    reports[i] = {
                        id: _report.id,
                        itemName: report.itemName
                    };
                }
            });
        } else {
            report.id = (reports.length) ? Math.max.apply(Math, reports.map((o) => o.id)) + 1 : 1;
            reports.push({
                id: report.id,
                itemName: report.itemName,
                type: report.type
            });
        }

        localStorage.setItem('report-' + report.id, JSON.stringify(report));
        localStorage.setItem('reports', JSON.stringify(reports));

        return new Observable((observer: any) => {
            observer.next({
                status: true,
                message: '',
                data: report
            });
        });
    }

    getReports() {

        const localReports = (localStorage.getItem('reports')) ? JSON.parse(localStorage.getItem('reports')) : [];

        localReports.forEach((report, i) => {
            if (!localStorage.getItem('report-' + report.id)) {
                localReports.splice(i, 1);
                localStorage.setItem('reports', JSON.stringify(localReports));
            }
        });

        return new Observable((observer: any) => {
            observer.next({
                status: true,
                message: '',
                data: localReports
            });
        });
    }

    getReport(id) {

        const localReports = [];

        // tslint:disable-next-line:variable-name
        id.forEach((_id) => {
            if (localStorage.getItem('report-' + _id)) {
                localReports.push(JSON.parse(localStorage.getItem('report-' + _id)));
            }
        });

        return new Observable((observer: any) => {
            observer.next({
                status: true,
                message: '',
                data: localReports
            });
        });
    }

    deleteReport(reportSelectedData) {

        const localReports = (localStorage.getItem('reports')) ? JSON.parse(localStorage.getItem('reports')) : [];

        localReports.forEach((report, i) => {
            if (report.id === reportSelectedData[0].id) {
                localReports.splice(i, 1);
                localStorage.removeItem('report-' + report.id);
            }
        });

        if (localReports.length) {
            localStorage.setItem('reports', JSON.stringify(localReports));
        } else {
            localStorage.removeItem('reports');
        }

        return new Observable((observer: any) => {
            observer.next({
                status: true,
                message: '',
                data: localReports
            });
        });
    }

    deleteReportsLocal() {

        const localReports = (localStorage.getItem('reports')) ? JSON.parse(localStorage.getItem('reports')) : [];

        localReports.forEach((report) => {
            localStorage.removeItem('report-' + report.id);
        });

        localStorage.removeItem('reports');
    }

    editReport(id, report) {
        // TODO al momento aggiorno solo il nome
        // in un secondo momento devo aggiornare tutto il report con le informazioni ricevute dalle API
        const reports = JSON.parse(localStorage.getItem('reports'));
        reports.forEach(ds => {
            if (ds.id === id) {
                ds.itemName = report.itemName;
            }
        });

        const _report = JSON.parse(localStorage.getItem('report-' + id));
        _report.itemName = report.itemName;

        localStorage.setItem('reports', JSON.stringify(reports));
        localStorage.setItem('report-' + id, JSON.stringify(_report));
    }

    getReportsSettings(reportData) {
        Object.keys(reportData).forEach((key, i) => {
            Object.keys(reportData[key]).forEach((subkey, i) => {

                const report = {
                    player_1: reportData[key][subkey].ref_player,
                    player_2: reportData[key][subkey].opp_player,
                    settings: {
                        data_type: ''
                    }
                };

                if (report.player_1) {
                    if (/[0-9-.]*\/[0-9]*/.test(report.player_1)) {
                        // @ts-ignore
                        // tslint:disable-next-line:no-eval
                        report.player_1_comparison = parseInt(String(eval(report.player_1) * 100), 10);
                    } else if (!isNaN(report.player_1)) {
                        report.player_1 = parseInt(report.player_1, 10);
                    }
                }

                if (report.player_2) {
                    if (/[0-9-.]*\/[0-9]*/.test(report.player_2)) {
                        // @ts-ignore
                        // tslint:disable-next-line:no-eval
                        report.player_2_comparison = parseInt(String(eval(report.player_2) * 100), 10);
                    } else if (!isNaN(report.player_2)) {
                        report.player_2 = parseInt(report.player_2, 10);
                    }
                }

                if (report.player_1 && report.player_2) {

                    if (/[0-9-.]*\/[0-9]*!/.test(report.player_1) && /[0-9-.]*\/[0-9]*!/.test(report.player_2)) {
                        report.settings.data_type = 'comparison';
                    } else if (!isNaN(report.player_1) && !isNaN(report.player_2)) {
                        report.settings.data_type = 'integer';
                    } else {
                        report.settings.data_type = 'string';
                    }

                }

                reportData[key][subkey] = report;
            });
        });

        return reportData;
    }
}
