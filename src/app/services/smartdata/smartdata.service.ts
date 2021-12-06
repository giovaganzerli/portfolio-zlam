import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import * as moment from 'moment';
import { map } from 'rxjs/operators';

// SERVICES
import { AuthService } from '../auth/auth.service';
import { GeneralService } from '../general/general.service';

@Injectable({
    providedIn: 'root'
})
export class SmartdataService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private generalService: GeneralService
    ) { }

    setSmartdataTypes() {
        const smartdataType = [
            {
                id: 'serve',
                itemName: 'Serve',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
            {
                id: 'return',
                itemName: 'Return',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
            {
                id: 'third_shot',
                itemName: '3rd Shot',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
            {
                id: 'fourth_shot',
                itemName: '4th Shot',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
            {
                id: 'final_shot',
                itemName: 'Final Shot',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
            {
                id: 'final_shot_rally_length',
                itemName: 'Rally Length',
                filters: {
                    common: ['serve_type', 'serve_side', 'serve_outcome']
                }
            },
        ];
        localStorage.setItem('smartdata-types', JSON.stringify(smartdataType));
    }

    getSmartdataTypes() {
        return (localStorage.getItem('smartdata-types')) ? JSON.parse(localStorage.getItem('smartdata-types')) : [];
    }

    removeSmartdataTypes() {
        localStorage.removeItem('smartdata-types');
    }

    getSmartdataFiltersCommon(type = 'all', smartdata = '') {
        const filters = [
            { id: 'serve_type', itemName: 'Serve type', values: ['1st', '2nd'] },
            { id: 'serve_side', itemName: 'Serve side', values: ['Ad', 'Deuce'] },
            { id: 'serve_bounce_angle', itemName: 'Serve bounce angle', values: ['T', 'Body', 'Wide'] },
            // tslint:disable-next-line:max-line-length
            { id: 'serve_placement', itemName: 'Serve placement', values: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'DF1', 'DF2', 'DF3', 'DF4', 'DF5', 'DF6', 'DF7', 'DF8'] },
            { id: 'serve_outcome', itemName: 'Serve outcome', values: ['IN', 'ACE', 'FAULT'] },
            // tslint:disable-next-line:max-line-length
            { id: 'serve_placement_first_fault', itemName: 'Serve placement first fault', values: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'] },
            // tslint:disable-next-line:max-line-length
            { id: 'return_type', itemName: 'Return type', values: ['approach bh', 'approach fh', 'backhand', 'backhand return', 'backhand slice', 'dropshot bh', 'drophot fh', 'forehand', 'forehand i-in', 'forehand i-out', 'forehand return', 'half volley bh', 'half volley fh', 'lob bh', 'lob fh', 'overhead', 'passing bh', 'passing fh', 'volley bh', 'volley fh'] },
            { id: 'return_contact', itemName: 'Return contact', values: ['A', 'B', 'C', 'D'] },
            { id: 'return_contact_depth', itemName: 'Return contact depth', values: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] },
            // tslint:disable-next-line:max-line-length
            { id: 'return_placement', itemName: 'Return placement', values: ['A', 'B', 'C', 'D', 'Net A', 'Net B', 'Net C', 'Net D', 'Out A', 'Out B', 'Out C', 'Out D'] },
            { id: 'return_angle', itemName: 'Return angle', values: ['CROSS', 'DTL'] },
            { id: 'return_outcome', itemName: 'Return outcome', values: ['error', 'winner', 'in play'] },
            // tslint:disable-next-line:max-line-length
            { id: 'third_shot_type', itemName: 'Third shot type', values: ['approach bh', 'approach fh', 'backhand', 'backhand return', 'backhand slice', 'dropshot bh', 'drophot fh', 'forehand', 'forehand i-in', 'forehand i-out', 'forehand return', 'half volley bh', 'half volley fh', 'lob bh', 'lob fh', 'overhead', 'passing bh', 'passing fh', 'volley bh', 'volley fh'] },
            { id: 'third_shot_contact', itemName: 'Third shot contact', values: ['A', 'B', 'C', 'D'] },
            { id: 'third_shot_contact_depth', itemName: 'Third shot contact depth', values: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] },
            // tslint:disable-next-line:max-line-length
            { id: 'third_shot_placement', itemName: 'Third shot placement', values: ['A', 'B', 'C', 'D', 'Net A', 'Net B', 'Net C', 'Net D', 'Out A', 'Out B', 'Out C', 'Out D'] },
            { id: 'third_shot_angle', itemName: 'Third shot angle', values: ['CROSS', 'DTL'] },
            { id: 'third_shot_outcome', itemName: 'Third shot outcome', values: ['error', 'winner', 'in play'] },
            // tslint:disable-next-line:max-line-length
            { id: 'fourth_shot_type', itemName: 'Fourt shot type', values: ['approach bh', 'approach fh', 'backhand', 'backhand return', 'backhand slice', 'dropshot bh', 'drophot fh', 'forehand', 'forehand i-in', 'forehand i-out', 'forehand return', 'half volley bh', 'half volley fh', 'lob bh', 'lob fh', 'overhead', 'passing bh', 'passing fh', 'volley bh', 'volley fh'] },
            { id: 'fourth_shot_contact', itemName: 'Fourth shot contact', values: ['A', 'B', 'C', 'D'] },
            { id: 'fourth_shot_contact_depth', itemName: 'Fourth shot contact depth', values: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] },
            // tslint:disable-next-line:max-line-length
            { id: 'fourth_shot_placement', itemName: 'Fourth shot placement', values: ['A', 'B', 'C', 'D', 'Net A', 'Net B', 'Net C', 'Net D', 'Out A', 'Out B', 'Out C', 'Out D'] },
            { id: 'fourth_shot_angle', itemName: 'Fourth shot angle', values: ['CROSS', 'DTL'] },
            { id: 'fourth_shot_outcome', itemName: 'Fourth shot outcome', values: ['error', 'winner', 'in play'] },
            // tslint:disable-next-line:max-line-length
            { id: 'final_shot_type', itemName: 'Final shot type', values: ['approach bh', 'approach fh', 'backhand', 'backhand return', 'backhand slice', 'dropshot bh', 'drophot fh', 'forehand', 'forehand i-in', 'forehand i-out', 'forehand return', 'half volley bh', 'half volley fh', 'lob bh', 'lob fh', 'overhead', 'passing bh', 'passing fh', 'volley bh', 'volley fh'] },
            { id: 'final_shot_contact', itemName: 'Final shot contact', values: ['A', 'B', 'C', 'D'] },
            { id: 'final_shot_contact_depth', itemName: 'Final shot contact depth', values: ['Z1', 'Z2', 'Z3', 'Z4', 'Z5'] },
            // tslint:disable-next-line:max-line-length
            { id: 'final_shot_placement', itemName: 'Final shot placement', values: ['A', 'B', 'C', 'D', 'Net A', 'Net B', 'Net C', 'Net D', 'Out A', 'Out B', 'Out C', 'Out D'] },
            { id: 'final_shot_angle', itemName: 'Final shot angle', values: ['CROSS', 'DTL'] },
            // tslint:disable-next-line:max-line-length
            { id: 'big_point', itemName: 'Big point', values: ['Building point', 'Pressure point', 'Break point', 'Game point', 'Set point', 'Match point'] },
            { id: 'final_shot_outcome', itemName: 'Final shot outcome', values: ['error', 'winner'] }
        ];

        filters.forEach((filter, i) => {
            const values = [];
            filter.values.forEach((value) => {
                values.push({
                    id: value.toLowerCase().replace(' ', '_'),
                    itemName: value
                });
            });
            filters[i].values = [...values];
        });

        if (type === 'common' && smartdata) {
            if (smartdata === 'serve') {
                return filters.filter((item) => {
                    return item.id === 'serve_type' || item.id === 'serve_side' || item.id === 'serve_outcome';
                });
            } else {
                return filters.filter((item) => {
                    return item.id === 'serve_type' || item.id === 'serve_side' || item.id === 'serve_outcome';
                });
            }
        } else if (type === 'field' && smartdata) {
            if (smartdata === 'serve') {
                return filters.filter((item) => {
                    return item.id === 'serve_placement' || item.id === 'return_contact' || item.id === 'return_contact_depth' || item.id === 'return_type';
                });
            } else {
                return [];
            }
        } else {
            return filters;
        }
    }

    deleteSmartdataLocal() {
        this.removeSmartdataTypes();
    }

    getSmartdataAggregations() {
        const aggregations = [
            {
                id: 'all',
                itemName: 'All'
            },
            {
                id: 'set',
                itemName: 'Set'
            },
            {
                id: 'match',
                itemName: 'Match'
            },
            {
                id: 'game',
                itemName: 'Game'
            }
        ];
        return aggregations;
    }

    translateSmartdataToString(smartdata, type, filters) {

        let strs = [];

        smartdata.forEach((data) => {

            const str = this['translate_' + type.id](data, filters); // type.subtype[0].id

            if (typeof str === 'string') {
                if (str) { strs.push({ description: str }); }
            } else {
                strs = [...strs, ...str];
            }
        });

        return strs;
    }

    translate_serve(data, filters) {

        let str = '';
        const players = JSON.parse(localStorage.getItem('players'));

        data.server = (data.server !== 'opp') ? parseInt(data.server, 10) : data.server;
        data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;

        if (data.server !== 'na') {

            if (data.winner.hasOwnProperty('ref_player') && data.winner.ref_player.length) {
                // tslint:disable-next-line:max-line-length
                data.winner.ref_player[0].counts = (data.winner.ref_player[0].counts !== 'na') ? parseInt(data.winner.ref_player[0].counts, 10) : false;
            } else {
                data.winner.ref_player = [];
            }

            if (data.winner.hasOwnProperty('opp_player') && data.winner.opp_player.length) {
                // tslint:disable-next-line:max-line-length
                data.winner.opp_player[0].counts = (data.winner.opp_player[0].counts !== 'na') ? parseInt(data.winner.opp_player[0].counts, 10) : false;
            } else {
                data.winner.opp_player = [];
            }

            if (data.server === 'opp') {
                if (filters.player.player_2.length > 1) {
                    str += 'Opponents';
                } else {
                    str += filters.player.player_2[0].itemName;
                }
            } else {
                str += this.generalService.findIntoArrayofObject(data.server, players, 'id').itemName;
            }

            if (data.serve_outcome === 'ACE') {
                if (data.counts !== 'na') {
                    str += ' score ' + data.counts + ' ' + data.serve_outcome;
                } else {
                    str += ' score an ' + data.serve_outcome;
                }
            } else if (data.serve_outcome === 'FAULT') {
                if (data.counts !== 'na') {
                    str += ' score ' + data.counts + ' ' + data.serve_outcome;
                } else {
                    str += ' score a ' + data.serve_outcome;
                }
            } else if (data.serve_outcome === 'IN') {
                str += ' <b>won';
                if (data.server === filters.player.player_1[0].id) {
                    if (data.winner.ref_player.length && data.winner.ref_player[0].counts !== 'na') {
                        if (data.counts !== 'na') {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + data.winner.ref_player[0].counts + '/' + data.counts + ' (' + (data.winner.ref_player[0].counts * 100 / data.counts).toFixed(2) + '%) points';
                        } else {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + data.winner.ref_player[0].counts + ' points';
                        }
                    } else if (data.winner.opp_player.length && data.winner.opp_player[0].counts !== 'na') {
                        if (data.counts !== 'na') {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + (data.counts - data.winner.opp_player[0].counts) + '/' + data.counts + ' (' + ((data.counts - data.winner.opp_player[0].counts) * 100 / data.counts).toFixed(2) + '%) points';
                        } else {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + (data.counts - data.winner.opp_player[0].counts) + ' points';
                        }
                    } else {
                        str += ' UNDETECTED points';
                    }
                } else {
                    if (data.winner.opp_player.length && data.winner.opp_player[0].counts !== 'na') {
                        if (data.counts !== 'na') {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + data.winner.opp_player[0].counts + '/' + data.counts + ' (' + (data.winner.opp_player[0].counts * 100 / data.counts).toFixed(2) + '%) points';
                        } else {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + data.winner.opp_player[0].counts + ' points';
                        }
                    } else if (data.winner.ref_player.length && data.winner.ref_player[0].counts !== 'na') {
                        if (data.counts !== 'na') {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + (data.counts - data.winner.ref_player[0].counts) + '/' + data.counts + ' (' + ((data.counts - data.winner.ref_player[0].counts) * 100 / data.counts).toFixed(2) + '%) points';
                        } else {
                            // tslint:disable-next-line:max-line-length
                            str += ' ' + (data.counts - data.winner.ref_player[0].counts) + ' points';
                        }
                    } else {
                        str += ' UNDETECTED points';
                    }
                }
                str += '</b>';
            }

            if (data.serve_type !== 'na') {
                str += ' serving ' + data.serve_type.toUpperCase() + ' serve';
            } else {
                str += ' serving';
            }

            if (data.serve_side !== 'na') {
                str += ' from ' + data.serve_side.toUpperCase() + ' court';
            }

            if (data.serve_bounce_angle !== 'na') {
                str += ' with a ' + data.serve_bounce_angle.toUpperCase() + ' angle';
            }

            if (data.serve_placement !== 'na') {
                str += ' to ' + data.serve_placement.toUpperCase();
            }

            if (data.return_type !== 'na') {
                str += ' in which';
                if (data.server === filters.player.player_1[0].id) {
                    if (filters.player.player_2.length > 1) {
                        str += ' opponents';
                    } else {
                        str += ' ' + filters.player.player_2[0].itemName;
                    }
                } else {
                    str += ' ' + filters.player.player_1[0].itemName;
                }
                str += ' returned a ' + data.return_type.toUpperCase();
                if (data.return_contact !== 'na') {
                    str += ' from ' + data.return_contact.toUpperCase();
                }
            }

            if (data.hasOwnProperty('match_id')) {
                str += ' in MATCH ' + data.match_id;
                if (data.hasOwnProperty('set_num')) {
                    str += ', SET ' + data.set_num;
                }
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.game_num;
                }
            } else if (data.hasOwnProperty('set_num')) {
                str += ' in SET ' + data.set_num;
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.set_num;
                }
            } else if (data.hasOwnProperty('game_num')) {
                str += ' in GAME ' + data.game_num;
            }

            if (data.serve_placement_first_fault !== 'na') {
                str += '. A first serve fault was observed in ' + data.serve_placement_first_fault.toUpperCase();
            } else {
                // str += '. No first serve fault was observed';
            }
        }

        return str;
    }

    translate_return(data, filters) {

        let str = '';

        data.server = (data.server !== 'opp') ? parseInt(data.server, 10) : data.server;
        data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;
        data.return_angle = (data.return_angle !== 'na') ? data.return_angle : 'UNDETECTED';
        data.return_contact = (data.return_contact !== 'na') ? data.return_contact : 'UNDETECTED';
        data.return_outcome = (data.return_outcome !== 'na') ? data.return_outcome : 'UNDETECTED';
        data.return_placement = (data.return_placement !== 'na') ? data.return_placement : 'UNDETECTED';
        data.return_type = (data.return_type !== 'na') ? data.return_type : 'UNDETECTED';

        if (data.server !== 'na') {

            str += filters.player.player_1[0].itemName + ' <b>won ';

            if (data.winner.ref_player.length && data.winner.ref_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + '/' + data.counts + ' (' + (data.winner.ref_player[0].counts * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + ' points';
                }
            } else if (data.winner.opp_player.length && data.winner.opp_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + '/' + data.counts + ' (' + ((data.counts - data.winner.opp_player[0].counts) * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + ' points';
                }
            } else {
                str += ' UNDETECTED points';
            }

            str += '</b>';

            if (data.server === filters.player.player_1[0].id) {
                str += ' serving and';
                if (filters.player.player_2.length > 1) {
                    str += ' the opponents hit';
                } else {
                    str += ' ' + filters.player.player_2[0].itemName + ' hit';
                }
            } else {
                str += ' when returning and hitting';
            }

            str += ` a ${data.return_type.toUpperCase()} third shot ${data.return_angle.toUpperCase()} `;
            str += ` from ${data.return_contact.toUpperCase()} to ${data.return_placement.toUpperCase()}`;

            if (data.third_shot_type !== 'na') {
                str += ' in which';
                if (data.server === filters.player.player_1[0].id) {
                    if (filters.player.player_2.length > 1) {
                        str += ' opponents';
                    } else {
                        str += ' ' + filters.player.player_2[0].itemName;
                    }
                } else {
                    str += ' ' + filters.player.player_1[0].itemName;
                }
                str += ' returned a ' + data.third_shot_type.toUpperCase();
                if (data.return_contact !== 'na') {
                    str += ' from ' + data.third_shot_contact.toUpperCase();
                }
            }

            if (data.hasOwnProperty('match_id')) {
                str += ' in MATCH ' + data.match_id;
                if (data.hasOwnProperty('set_num')) {
                    str += ', SET ' + data.set_num;
                }
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.game_num;
                }
            } else if (data.hasOwnProperty('set_num')) {
                str += ' in SET ' + data.set_num;
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.set_num;
                }
            } else if (data.hasOwnProperty('game_num')) {
                str += ' in GAME ' + data.game_num;
            }
        }

        return str;
    }

    translate_third_shot(data, filters) {

        let str = '';

        data.server = (data.server !== 'opp') ? parseInt(data.server, 10) : data.server;
        data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;
        data.third_shot_angle = (data.third_shot_angle !== 'na') ? data.third_shot_angle : 'UNDETECTED';
        data.third_shot_contact = (data.third_shot_contact !== 'na') ? data.third_shot_contact : 'UNDETECTED';
        data.third_shot_outcome = (data.third_shot_outcome !== 'na') ? data.third_shot_outcome : 'UNDETECTED';
        data.third_shot_placement = (data.third_shot_placement !== 'na') ? data.third_shot_placement : 'UNDETECTED';
        data.third_shot_type = (data.third_shot_type !== 'na') ? data.third_shot_type : 'UNDETECTED';

        if (data.server !== 'na') {

            str += filters.player.player_1[0].itemName + ' <b>won ';

            if (data.winner.ref_player.length && data.winner.ref_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + '/' + data.counts + ' (' + (data.winner.ref_player[0].counts * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + ' points';
                }
            } else if (data.winner.opp_player.length && data.winner.opp_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + '/' + data.counts + ' (' + ((data.counts - data.winner.opp_player[0].counts) * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + ' points';
                }
            } else {
                str += ' UNDETECTED points';
            }

            str += '</b>';

            if (data.server === filters.player.player_1[0].id) {
                str += ' serving and';
                if (filters.player.player_2.length > 1) {
                    str += ' the opponents hit';
                } else {
                    str += ' ' + filters.player.player_2[0].itemName + ' hit';
                }
            } else {
                str += ' when returning and hitting';
            }

            str += ` a ${data.third_shot_type.toUpperCase()} third shot ${data.third_shot_angle.toUpperCase()} `;
            str += ` from ${data.third_shot_contact.toUpperCase()} to ${data.third_shot_placement.toUpperCase()}`;

            if (data.fourth_shot_type !== 'na') {
                str += ' in which';
                if (data.server === filters.player.player_1[0].id) {
                    if (filters.player.player_2.length > 1) {
                        str += ' opponents';
                    } else {
                        str += ' ' + filters.player.player_2[0].itemName;
                    }
                } else {
                    str += ' ' + filters.player.player_1[0].itemName;
                }
                str += ' returned a ' + data.fourth_shot_type.toUpperCase();
                if (data.return_contact !== 'na') {
                    str += ' from ' + data.fourth_shot_contact.toUpperCase();
                }
            }

            if (data.hasOwnProperty('match_id')) {
                str += ' in MATCH ' + data.match_id;
                if (data.hasOwnProperty('set_num')) {
                    str += ', SET ' + data.set_num;
                }
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.game_num;
                }
            } else if (data.hasOwnProperty('set_num')) {
                str += ' in SET ' + data.set_num;
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.set_num;
                }
            } else if (data.hasOwnProperty('game_num')) {
                str += ' in GAME ' + data.game_num;
            }
        }

        return str;
    }

    translate_fourth_shot(data, filters) {

        let str = '';

        data.server = (data.server !== 'opp') ? parseInt(data.server, 10) : data.server;
        data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;
        data.fourth_shot_angle = (data.fourth_shot_angle !== 'na') ? data.fourth_shot_angle : 'UNDETECTED';
        data.fourth_shot_contact = (data.fourth_shot_contact !== 'na') ? data.fourth_shot_contact : 'UNDETECTED';
        data.fourth_shot_outcome = (data.fourth_shot_outcome !== 'na') ? data.fourth_shot_outcome : 'UNDETECTED';
        data.fourth_shot_placement = (data.fourth_shot_placement !== 'na') ? data.fourth_shot_placement : 'UNDETECTED';
        data.fourth_shot_type = (data.fourth_shot_type !== 'na') ? data.fourth_shot_type : 'UNDETECTED';

        if (data.server !== 'na') {

            str += filters.player.player_1[0].itemName + ' <b>won ';

            if (data.winner.ref_player.length && data.winner.ref_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + '/' + data.counts + ' (' + (data.winner.ref_player[0].counts * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + data.winner.ref_player[0].counts + ' points';
                }
            } else if (data.winner.opp_player.length && data.winner.opp_player[0].counts !== 'na') {
                if (data.counts !== 'na') {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + '/' + data.counts + ' (' + ((data.counts - data.winner.opp_player[0].counts) * 100 / data.counts).toFixed(2) + '%) points';
                } else {
                    // tslint:disable-next-line:max-line-length
                    str += ' ' + (data.counts - data.winner.opp_player[0].counts) + ' points';
                }
            } else {
                str += ' UNDETECTED points';
            }

            str += '</b>';

            if (data.server === filters.player.player_1[0].id) {
                str += ' serving and';
                if (filters.player.player_2.length > 1) {
                    str += ' the opponents hit';
                } else {
                    str += ' ' + filters.player.player_2[0].itemName + ' hit';
                }
            } else {
                str += ' when returning and hitting';
            }

            str += ` a ${data.fourth_shot_type.toUpperCase()} fourth shot ${data.fourth_shot_angle.toUpperCase()} `;
            str += ` from ${data.fourth_shot_contact.toUpperCase()} to ${data.fourth_shot_placement.toUpperCase()}`;

            if (data.hasOwnProperty('match_id')) {
                str += ' in MATCH ' + data.match_id;
                if (data.hasOwnProperty('set_num')) {
                    str += ', SET ' + data.set_num;
                }
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.game_num;
                }
            } else if (data.hasOwnProperty('set_num')) {
                str += ' in SET ' + data.set_num;
                if (data.hasOwnProperty('game_num')) {
                    str += ', GAME ' + data.set_num;
                }
            } else if (data.hasOwnProperty('game_num')) {
                str += ' in GAME ' + data.game_num;
            }
        }

        return str;
    }

    translate_final_shot(data, filters) {

        const strs = [];
        const players = JSON.parse(localStorage.getItem('players'));

        Object.entries(data['final_shot_outcome, final_shot_placement']).forEach((entry) => {

            const key = entry[0].split(', ');
            let value = entry[1];
            let str = '';

            if (data.final_shooter !== 'na') {

                data.final_shooter = (data.final_shooter !== 'opp') ? parseInt(data.final_shooter, 10) : data.final_shooter;
                data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;
                data.final_shot_angle = (data.final_shot_angle !== 'na') ? data.final_shot_angle : 'UNDETECTED';
                data.final_shot_contact = (data.final_shot_contact !== 'na') ? data.final_shot_contact : 'UNDETECTED';
                data.final_shot_type = (data.final_shot_type !== 'na') ? data.final_shot_type : 'UNDETECTED';

                if (data.server === 'opp') {
                    if (filters.player.player_2.length > 1) {
                        str += 'Opponents ';
                    } else {
                        str += filters.player.player_2[0].itemName + ' ';
                    }
                } else {
                    str += this.generalService.findIntoArrayofObject(data.final_shooter, players, 'id').itemName + ' ';
                }

                key[0] = (key[0] !== 'na') ? key[0] : 'UNDETECTED';
                key[1] = (key[1] !== 'na') ? key[1] : 'UNDETECTED';
                value = (value !== 'na') ? parseInt(value.toString(), 10) : 'UNDETECTED';

                str += '<b>';
                str += (key[0] === 'winner') ? 'won ' : 'lost ';
                if (data.counts !== 'na' && value !== 'UNDETECTED') {
                    str += value + '/' + data.counts + '(' + (parseInt(value.toString(), 10) / data.counts * 100).toFixed(2) + '%)';
                } else {
                    str += value;
                }
                str += '</b>';
                str += ` points when hitting a ${data.final_shot_type.toUpperCase()} final shot ${data.final_shot_angle.toUpperCase()} `;
                str += ` from ${data.final_shot_contact.toUpperCase()} to ${key[1].toUpperCase()}`;

                if (data.hasOwnProperty('num_shots')) {
                    // NB: Aggiungo il numero di shot per il final rally length
                    str += ` in ${data.num_shots} shots`;
                }

                if (data.hasOwnProperty('match_id')) {
                    str += ' in MATCH ' + data.match_id;
                    if (data.hasOwnProperty('set_num')) {
                        str += ', SET ' + data.set_num;
                    }
                    if (data.hasOwnProperty('game_num')) {
                        str += ', GAME ' + data.game_num;
                    }
                } else if (data.hasOwnProperty('set_num')) {
                    str += ' in SET ' + data.set_num;
                    if (data.hasOwnProperty('game_num')) {
                        str += ', GAME ' + data.set_num;
                    }
                } else if (data.hasOwnProperty('game_num')) {
                    str += ' in GAME ' + data.game_num;
                }

                strs.push({ description: str });
            }
        });

        return strs;
    }

    translate_final_shot_rally_length(data, filters) {

        const strs = [];
        const players = JSON.parse(localStorage.getItem('players'));

        Object.entries(data['final_shot_outcome, final_shot_placement']).forEach((entry) => {

            const key = entry[0].split(', ');
            let value = entry[1];
            let str = '';

            if (data.final_shooter !== 'na') {

                data.final_shooter = (data.final_shooter !== 'opp') ? parseInt(data.final_shooter, 10) : data.final_shooter;
                data.counts = (data.counts !== 'na') ? parseInt(data.counts, 10) : data.counts;
                data.final_shot_angle = (data.final_shot_angle !== 'na') ? data.final_shot_angle : 'UNDETECTED';
                data.final_shot_contact = (data.final_shot_contact !== 'na') ? data.final_shot_contact : 'UNDETECTED';
                data.final_shot_type = (data.final_shot_type !== 'na') ? data.final_shot_type : 'UNDETECTED';

                if (data.server === 'opp') {
                    if (filters.player.player_2.length > 1) {
                        str += 'Opponents ';
                    } else {
                        str += filters.player.player_2[0].itemName + ' ';
                    }
                } else {
                    str += this.generalService.findIntoArrayofObject(data.final_shooter, players, 'id').itemName + ' ';
                }

                key[0] = (key[0] !== 'na') ? key[0] : 'UNDETECTED';
                key[1] = (key[1] !== 'na') ? key[1] : 'UNDETECTED';
                // @ts-ignore
                value = (value !== 'na') ? parseInt(value, 10) : 'UNDETECTED';

                str += '<b>';
                str += (key[0] === 'winner') ? 'won ' : 'lost ';
                if (data.counts !== 'na' && value !== 'UNDETECTED') {
                    // @ts-ignore
                    str += value + '/' + data.counts + '(' + (value / data.counts * 100).toFixed(2) + '%)';
                } else {
                    str += value;
                }
                str += '</b>';
                str += ` points when hitting a ${data.final_shot_type.toUpperCase()} final shot ${data.final_shot_angle.toUpperCase()} `;
                // @ts-ignore
                str += ` from ${data.final_shot_contact.toUpperCase()} to ${key[1].toUpperCase()}`;

                if (data.hasOwnProperty('num_shots')) {
                    // NB: Aggiungo il numero di shot per il final rally length
                    str += ` in ${data.num_shots} shots`;
                }

                if (data.hasOwnProperty('match_id')) {
                    str += ' in MATCH ' + data.match_id;
                    if (data.hasOwnProperty('set_num')) {
                        str += ', SET ' + data.set_num;
                    }
                    if (data.hasOwnProperty('game_num')) {
                        str += ', GAME ' + data.game_num;
                    }
                } else if (data.hasOwnProperty('set_num')) {
                    str += ' in SET ' + data.set_num;
                    if (data.hasOwnProperty('game_num')) {
                        str += ', GAME ' + data.set_num;
                    }
                } else if (data.hasOwnProperty('game_num')) {
                    str += ' in GAME ' + data.game_num;
                }

                strs.push({ description: str });
            }
        });

        return strs;
    }

}
