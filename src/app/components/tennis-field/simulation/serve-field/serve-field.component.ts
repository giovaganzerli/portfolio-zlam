import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewChildren} from '@angular/core';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { FiltersService } from '../../../../services/filters/filters.service';
import { SmartdataService } from '../../../../services/smartdata/smartdata.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-serve-field',
    templateUrl: './serve-field.component.html',
    styleUrls: ['./serve-field.component.scss']
})
export class ServeFieldComponent implements OnInit, OnChanges {

    @ViewChild('tennisField') tennisField: ElementRef;
    @ViewChild('tennisFieldStatsAd') tennisFieldStatsAd: ElementRef;
    @ViewChild('tennisFieldStatsDeuce') tennisFieldStatsDeuce: ElementRef;

    @ViewChild('bounceS5') bounceS5: ElementRef;
    @ViewChild('bounceS6') bounceS6: ElementRef;
    @ViewChild('bounceS7') bounceS7: ElementRef;
    @ViewChild('bounceS8') bounceS8: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bounceS5_8') bounceS5_8: ElementRef;
    @ViewChild('bounceS1') bounceS1: ElementRef;
    @ViewChild('bounceS2') bounceS2: ElementRef;
    @ViewChild('bounceS3') bounceS3: ElementRef;
    @ViewChild('bounceS4') bounceS4: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bounceS1_4') bounceS1_4: ElementRef;
    @ViewChild('bounceAceAd') bounceAceAd: ElementRef;
    @ViewChild('bounceAceDeuce') bounceAceDeuce: ElementRef;
    @ViewChild('bounceAce1') bounceAce1: ElementRef;
    @ViewChild('bounceAce2') bounceAce2: ElementRef;
    @ViewChild('bounceAce3') bounceAce3: ElementRef;
    @ViewChild('bounceAce4') bounceAce4: ElementRef;
    @ViewChild('bounceAce5') bounceAce5: ElementRef;
    @ViewChild('bounceAce6') bounceAce6: ElementRef;
    @ViewChild('bounceAce7') bounceAce7: ElementRef;
    @ViewChild('bounceAce8') bounceAce8: ElementRef;
    //commentato, sarà utile per il return
    // @ViewChild('bounceFaultAd') bounceFaultAd: ElementRef;
    // @ViewChild('bounceFaultDeuce') bounceFaultDeuce: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_1Ad') bouncePlayer_1Ad: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_1Deuce') bouncePlayer_1Deuce: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2Ad') bouncePlayer_2Ad: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2AdBH') bouncePlayer_2AdBH: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2AdFH') bouncePlayer_2AdFH: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2Deuce') bouncePlayer_2Deuce: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2DeuceBH') bouncePlayer_2DeuceBH: ElementRef;
    // tslint:disable-next-line:variable-name
    @ViewChild('bouncePlayer_2DeuceFH') bouncePlayer_2DeuceFH: ElementRef;

    // INIT DATA
    filters;
    report;
    formData;
    simulationFiltersHistory;
    fullScreen: boolean;

    // INIT SELECTED DATA
    fieldSelected;
    insightSelected;
    statsSelected;

    // INIT VALIDATE DATA
    enableFieldSelected;
    validateFieldSelected;

    @Input() modeSelected: any;
    @Input() filtersSelected: any;
    @Input() resultsData: any;
    @Output() modeSelectedEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private filtersService: FiltersService,
        private smartdataService: SmartdataService,
        private dataExchangeService: DataExchangeService
    ) { }

    // INIT DATA
    initFiltersData(type) {

        if (!this.filters) {
            this.filters = {
                common: [],
                trajectories: {},
                player: {
                    player_2: {
                        x: {
                            ad: 0,
                            d: 0,
                            c: -60,
                            middle: -123,
                            b: -185,
                            a: -245,
                            deuce: -245
                        },
                        y: {
                            z1: 250,
                            z2: 133,
                            z3: 57,
                            z4: -3,
                            z5: -53
                        }
                    }
                }
            };
        }

        if (type === 'common' || type === 'all') {
            this.filters.common = this.getSmartdataFilters('common');
        }

        if (type === 'trajectories' || type === 'all') {
            this.filters.trajectories = {
                ad: {
                    serve_side: this.bouncePlayer_1Ad.nativeElement,
                    serve_placement: {
                        df: this.bounceS5_8.nativeElement,
                        s5: this.bounceS5.nativeElement,
                        s6: this.bounceS6.nativeElement,
                        s7: this.bounceS7.nativeElement,
                        s8: this.bounceS8.nativeElement
                    },
                    serve_outcome: {
                        ace: {
                            df: this.bounceAceAd.nativeElement,
                            s5: this.bounceAce5.nativeElement,
                            s6: this.bounceAce6.nativeElement,
                            s7: this.bounceAce7.nativeElement,
                            s8: this.bounceAce8.nativeElement
                        },
                        //commentato, sarà utile per il return
                        // fault: {
                        //     df: this.bounceFaultAd.nativeElement
                        // }
                    },
                    return_type: {
                        df: this.bouncePlayer_2Deuce.nativeElement,
                        backhand_return: this.bouncePlayer_2AdBH.nativeElement,
                        forehand_return: this.bouncePlayer_2AdFH.nativeElement
                    }
                },
                deuce: {
                    serve_side: this.bouncePlayer_1Deuce.nativeElement,
                    serve_placement: {
                        df: this.bounceS1_4.nativeElement,
                        s1: this.bounceS1.nativeElement,
                        s2: this.bounceS2.nativeElement,
                        s3: this.bounceS3.nativeElement,
                        s4: this.bounceS4.nativeElement
                    },
                    serve_outcome: {
                        ace: {
                            df: this.bounceAceDeuce.nativeElement,
                            s1: this.bounceAce1.nativeElement,
                            s2: this.bounceAce2.nativeElement,
                            s3: this.bounceAce3.nativeElement,
                            s4: this.bounceAce4.nativeElement
                        },
                        //commentato, sarà utile per il return
                        // fault: {
                        //     df: this.bounceFaultDeuce.nativeElement
                        // }
                    },
                    return_type: {
                        df: this.bouncePlayer_2Deuce.nativeElement,
                        backhand_return: this.bouncePlayer_2DeuceBH.nativeElement,
                        forehand_return: this.bouncePlayer_2DeuceFH.nativeElement
                    }
                }
            };
        }
    }

    initFormData() {
        this.formData = {
            isValid: true,
            message: ''
        };
    }

    initSimulationFiltersHistoryData() {
        this.simulationFiltersHistory = [];
    }

    // INIT SELECTED DATA
    initSelectedFieldData() {
        this.fieldSelected = {
            ad: {
                player_2: {
                    x: this.filters.player.player_2.x.ad,
                    y: this.filters.player.player_2.y.z4,
                    offx: 0,
                    offy: 0
                },
                trajectory: [],
                filters: {}
            },
            deuce: {
                player_2: {
                    x: this.filters.player.player_2.x.deuce,
                    y: this.filters.player.player_2.y.z4,
                    offx: 0,
                    offy: 0
                },
                trajectory: [],
                filters: {}
            },
        };
    }

    initInsightSelectedData() {
        this.insightSelected = {
            type: {
                id: '',
                itemName: ''
            },
            view: {
                id: 'graph_bars',
                itemName: 'Graph Bars'
            },
            side: []
        };
    }

    initStatsSelectedData() {
        this.statsSelected = {
            ad: {
                ace: 0,
                '1st': {
                    itemName: '1st Serve Won',
                    points: 0,
                    counts: 0,
                    fault: 0
                },
                '2nd': {
                    itemName: '2nd Serve Won',
                    points: 0,
                    counts: 0,
                    fault: 0
                }
            },
            deuce: {
                ace: 0,
                '1st': {
                    itemName: '1st Serve Won',
                    points: 0,
                    counts: 0,
                    fault: 0
                },
                '2nd': {
                    itemName: '2nd Serve Won',
                    points: 0,
                    counts: 0,
                    fault: 0
                }
            }
        };
    }

    // INIT VALIDATE

    initValidateFieldSelectedData() {
        this.validateFieldSelected = {
            ad: {
                serve_side: true,
                serve_placement: {
                    df: true,
                    s5: true,
                    s6: true,
                    s7: true,
                    s8: true
                },
                serve_outcome: {
                    ace: {
                        df: true,
                        s5: true,
                        s6: true,
                        s7: true,
                        s8: true
                    }
                },
                return_type: {
                    df: true,
                    backhand_return: true,
                    forehand_return: true,
                },
                return_contact: {
                    c: true,
                    d: true
                }
            },
            deuce: {
                serve_side: true,
                serve_placement: {
                    df: true,
                    s1: true,
                    s2: true,
                    s3: true,
                    s4: true
                },
                serve_outcome: {
                    ace: {
                        df: true,
                        s1: true,
                        s2: true,
                        s3: true,
                        s4: true
                    }
                },
                return_type: {
                    df: true,
                    backhand_return: true,
                    forehand_return: true
                },
                return_contact: {
                    a: true,
                    b: true
                }
            },
            return_contact_depth: {
                z1: true,
                z2: true,
                z3: true,
                z4: true,
                z5: true
            }
        };
    }

    initEnableFieldSelectedData() {
        this.enableFieldSelected = {
            ad: {
                serve_placement: {
                    s5: true,
                    s6: true,
                    s7: true,
                    s8: true
                },
                return_type: {
                    backhand_return: true,
                    forehand_return: true,
                },
                return_contact: {
                    c: true,
                    d: true
                }
            },
            deuce: {
                serve_placement: {
                    s1: true,
                    s2: true,
                    s3: true,
                    s4: true
                },
                return_type: {
                    backhand_return: true,
                    forehand_return: true
                },
                return_contact: {
                    a: true,
                    b: true
                }
            },
            return_contact_depth: {
                z1: false,
                z2: true,
                z3: true,
                z4: true,
                z5: true
            }
        };
    }

    // GET DATA
    getSmartdataFilters(type) {
        if (type === 'common') {
            return this.smartdataService.getSmartdataFiltersCommon();
        }
    }

    // tslint:disable-next-line:max-line-length
    getMatches(filters = this.filtersSelected) {
        return this.filtersService.getMatches(this.resultsData.match.map(value => value.id), [], filters, 0);
    }

    getCommonFiltersSelectedString(type) {
        let str = '';
        this.filtersSelected.common[type].values.forEach((value, i) => {
            if (i < this.filtersSelected.common[type].values.length - 1) {
                str += value.itemName + ', ';
            } else {
                str += value.itemName;
            }
        });
        if (type === 'serve_type') {
            if (!str) {
                str = '1st, 2nd';
            }
            str += ' serve';
        } else if (type === 'serve_side') {
            str += ' side';
        } else if (type === 'serve_outcome') {
            str += ' outcome';
        }
        return str;
    }

    // INIT EVENT
    onFieldSideSelect(side, behavior = true) {

        // tslint:disable-next-line:variable-name
        const serve_type = this.generalService.findIntoArrayofObject('serve_type', this.filters.common, 'id');
        // tslint:disable-next-line:variable-name
        const serve_side = this.generalService.findIntoArrayofObject('serve_side', this.filters.common, 'id');
        // tslint:disable-next-line:variable-name
        const serve_outcome = this.generalService.findIntoArrayofObject('serve_outcome', this.filters.common, 'id');

        // CONTROLLO SE IL LATO ERA GIA SELEZIONATO
        if (this.generalService.findIntoArrayofObject(side, this.filtersSelected.common.serve_side.values, 'id')) {

            // RIMUOVO IL LATO SELEZIONATO
            this.filtersSelected.common.serve_side.values = this.generalService.removeObjectFromArray(side, this.filtersSelected.common.serve_side.values, 'id');

            // ELIMINO DALL'ARRAY DEI FILTRI QUELLI RELATIVI AL LATO SELEZIONATO
            Object.keys(this.fieldSelected[side].filters).forEach((key) => {
                this.fieldSelected[side].filters[key].values.forEach((value) => {
                    this.filtersSelected.field[side][key].values = this.generalService.removeObjectFromArray(value.id, this.filtersSelected.field[side][key].values, 'id');
                });
            });

            // RESETTO I FILTRI SUL CAMPO PER IL LATO SELEZIONATO
            this.fieldSelected[side].filters = {};

            // RESETTO LA POSIZIONE DI DEFAULT DEL GIOCATORE PER IL LATO SELEZIONATO
            this.fieldSelected[side].player_2.x = this.filters.player.player_2.x[side];
            this.fieldSelected[side].player_2.y = this.filters.player.player_2.y.z4;
            this.fieldSelected[side].player_2.offx = 0;
            this.fieldSelected[side].player_2.offy = 0;

            // RESETTO LE TRAIETTORIE DEL LATO SELEZIONATO
            this.fieldSelected[side].trajectory = [];

            // RIMUOVO I FILTRI RIMOSSI ANCHE DALLA CRONOLOGIA DEI FILTRI E AGGIORNO LA STORIA
            this.simulationFiltersHistory = this.simulationFiltersHistory.filter((history) => {
                return history.side !== side;
            });
            this.dataExchangeService.setSimulationFiltersHistoryData(this.simulationFiltersHistory);

        } else {

            // AGGIUNGO IL LATO SELEZIONATO NELL'ARRAY DEI FILTRI
            this.filtersSelected.common.serve_side.values.push(this.generalService.findIntoArrayofObject(side, serve_side.values, 'id'));

            // CONTROLLO SE CI SONO ANCORA SERVE OUTCOME SELEZIONATI
            if (!this.filtersSelected.common.serve_outcome.values.length) {
                // SE NON HO SERVE OUTCOME SELEZIONATI SETTO L'IN COME DEFAULT
                this.filtersSelected.common.serve_outcome.values.push(this.generalService.findIntoArrayofObject('in', serve_outcome.values, 'id'));
            }

            if (!this.filtersSelected.common.serve_type.values.length) {
                this.filtersSelected.common.serve_type = {...serve_type};
            }

            if (this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id')) { // || this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')

                // INIT TRAJECTORY
                const coords = {
                    start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                    middle: this.getPointCoords(this.filters.trajectories[side].serve_placement.df),
                    end: this.getPointCoords(this.filters.trajectories[side].return_type.df, this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy)
                };
                this.addTrajectory(side, coords, 'in-df-df');

                // commentato, sarà utile per il serve
                // if (this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {

                //     // INIT TRAJECTORY
                //     coords = {
                //         start: this.getPointCoords(this.filters.trajectories[side].return_type.df, this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy),
                //         middle: this.getPointCoords(this.filters.trajectories[side].serve_outcome.fault.df),
                //         // @ts-ignore
                //         end: false
                //     };
                //     this.addTrajectory(side, coords, 'fault-df-df');
                // }

            } else if (this.generalService.findIntoArrayofObject('ace', this.filtersSelected.common.serve_outcome.values, 'id')) {

                // INIT TRAJECTORY
                const coords = {
                    start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                    middle: this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace.df),
                    end: false
                };
                this.addTrajectory(side, coords, 'ace-df-nd');

            }
        }

        if (behavior) {
            // AGGIORNO I RISULTATI
            this.updateSelectedFiltersData( 'serve_side', '', [side]);
        } else {
            this.initEnableFieldSelectedData();
            this.checkFieldSelectedData();
            this.checkTrajectories();
        }
    }

    onFieldFiltersSelect(field, value, sides) {

        // tslint:disable-next-line:variable-name
        const field_obj = this.generalService.findIntoArrayofObject(field, this.filters.common, 'id');
        // tslint:disable-next-line:variable-name
        const value_obj = this.generalService.findIntoArrayofObject(value, field_obj.values, 'id');
        // tslint:disable-next-line:variable-name
        const serve_outcome = this.generalService.findIntoArrayofObject('serve_outcome', this.filters.common, 'id');

        // SCORRO I LATI DA MODIFICARE
        sides.forEach((side) => {

            let currPlacement;

            // CONTROLLO SE IL LATO È GIA' ATTIVO
            if (!this.generalService.findIntoArrayofObject(side, this.filtersSelected.common.serve_side.values, 'id')) {
                // ATTIVO IL LATO
                this.onFieldSideSelect(side, false);
            }

            // CONTROLLO SE L'ARRAY DI CAMPI CONTIENE GIA I CAMPI SELEZIONATI
            if (!this.fieldSelected[side].filters.hasOwnProperty(field)) {
                // AGGIUNGO I CAMPI SELEZIONATI ALL'ARRAY DI FILTRI RELATIVO AL LATO SELEZIONATO
                this.fieldSelected[side].filters[field] = {...field_obj};
                this.fieldSelected[side].filters[field].values = [];
            }

            // CONTROLLO SE HO CLICCATO SU UN CAMPO GIA' ATTIVO
            if (this.generalService.findIntoArrayofObject(value, this.fieldSelected[side].filters[field].values, 'id')) {

                // RIMUOVO IL FILTRO DALL'ARRAY DEL LATO SELEZIONATO
                this.fieldSelected[side].filters[field].values = this.generalService.removeObjectFromArray(value, this.fieldSelected[side].filters[field].values, 'id');

                currPlacement = (this.fieldSelected[side].filters.hasOwnProperty('serve_placement') && this.fieldSelected[side].filters.serve_placement.values.length) ? this.fieldSelected[side].filters.serve_placement.values[0].id  : 'df';

                // CONTROLLO LA TIPOLOGIA DI CAMPO SELEZIONATO PER SETTARE LA POSIZIONE DI DEFAULT DEL PLAYER_2
                if (field === 'return_contact') {
                    this.fieldSelected[side].player_2.x = this.filters.player.player_2.x[side];
                } else if (field === 'return_contact_depth') {
                    this.fieldSelected[side].player_2.y = this.filters.player.player_2.y.z4;
                }

                // CONTROLLO LA TIPOLOGIA DI CAMPO SELEZIONATO PER RIMUOVERE/MODIFICARE LE TRAIETTORIE
                if (field === 'serve_placement') {

                    // INIT TRAJECTORY
                    const coords = {
                        start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                        middle: this.getPointCoords(this.filters.trajectories[side].serve_placement.df),
                        end: (side === 'ad') ? this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace.s8) : this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace.s1)
                    };

                    this.editTrajectory(side, 'in-', 'middle', coords.middle);
                    this.editTrajectory(side, 'in-', 'middle', coords.middle);
                    this.editTrajectory(side, 'ace-', 'middle', coords.middle);

                    if (!this.fieldSelected[side].filters.serve_placement.values.length && !this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id') && !this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {
                        this.editTrajectory(side, 'ace-', 'end', false);
                    } else {
                        this.editTrajectory(side, 'ace-', 'end', coords.end);
                    }

                } else if (field === 'return_type') {

                    if (side === 'ad' && value === 'forehand_return') {
                        this.fieldSelected.ad.player_2.offx += -40;
                    } else if (side === 'ad' && value === 'backhand_return') {
                        this.fieldSelected.ad.player_2.offx += 40;
                    }

                    if (side === 'deuce' && value === 'forehand_return') {
                        this.fieldSelected.deuce.player_2.offx += -40;
                    } else if (side === 'deuce' && value === 'backhand_return') {
                        this.fieldSelected.deuce.player_2.offx += 40;
                    }

                    this.removeTrajectory(side, 'in-' + currPlacement + '-' + value);

                    //commentato, sarà utile per il return
                    // if (this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {
                    //     this.removeTrajectory(side, 'fault-' + value + '-df');
                    //     if (!this.fieldSelected[side].filters[field].values.length) {
                    //         const coords = {
                    //             start: this.getPointCoords(this.filters.trajectories[side].return_type.df, this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy),
                    //             middle: this.getPointCoords(this.filters.trajectories[side].serve_outcome.fault.df),
                    //             end: false
                    //         };
                    //         this.fieldSelected[side].player_2.offx = 0;
                    //         this.addTrajectory(side, coords, 'fault-df-df');
                    //     }
                    // }

                    if (!this.fieldSelected[side].filters[field].values.length) {
                        const coords = {
                            start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                            middle: this.getPointCoords(this.filters.trajectories[side].serve_placement[currPlacement]),
                            end: this.getPointCoords(this.filters.trajectories[side].return_type.df, this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy)
                        };
                        this.fieldSelected[side].player_2.offx = 0;
                        this.addTrajectory(side, coords, 'in-' + currPlacement + '-df');
                    }

                } else if (field === 'return_contact' || field === 'return_contact_depth') {

                }

            } else {

                if (field !== 'return_type') {
                    // RESETTO I FILTRI ATTIVI PER IL LATO SELEZIONATO
                    this.fieldSelected[side].filters[field].values = [];
                }

                // AGGIORNO I FILTRI ATTIVI PER IL LATO SELEZIONATO
                this.fieldSelected[side].filters[field].values.push(value_obj);

                currPlacement = (this.fieldSelected[side].filters.hasOwnProperty('serve_placement') && this.fieldSelected[side].filters.serve_placement.values.length) ? this.fieldSelected[side].filters.serve_placement.values[0].id  : 'df';

                // CONTROLLO LA TIPOLOGIA DI CAMPO SELEZIONATO PER SETTARE LA POSIZIONE DEL PLAYER_2
                if (field === 'return_contact') {
                    this.fieldSelected[side].player_2.x = this.filters.player.player_2.x[value];
                } else if (field === 'return_contact_depth') {
                    this.fieldSelected[side].player_2.y = this.filters.player.player_2.y[this.fieldSelected[side].filters[field].values[0].id];
                }

                // CONTROLLO LA TIPOLOGIA DI CAMPO SELEZIONATO PER AGGIUNGERE/MODIFICARE LE TRAIETTORIE
                if (field === 'serve_placement') {

                    currPlacement = value;

                    // INIT TRAJECTORY
                    const coords = {
                        start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                        middle: this.getPointCoords(this.filters.trajectories[side].serve_placement[value]),
                        end: (side === 'ad') ? this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace.s8) : this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace.s1)
                    };

                    if (this.fieldSelected[side].filters.hasOwnProperty('serve_placement')) {
                        coords.end = this.getPointCoords(this.filters.trajectories[side].serve_outcome.ace[currPlacement]);
                    }

                    this.editTrajectory(side, 'ace-', 'end', coords.end);
                    this.editTrajectory(side, 'ace-', 'middle', coords.middle);
                    this.editTrajectory(side, 'in-', 'middle', coords.middle);
                    this.editTrajectory(side, 'in-', 'middle', coords.middle);

                } else if (field === 'return_type') {

                    if (!this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id')) {
                        this.filtersSelected.common.serve_outcome.values.push(this.generalService.findIntoArrayofObject('in', serve_outcome.values, 'id'));
                    }

                    let coords = {
                        start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                        middle: this.getPointCoords(this.filters.trajectories[side].serve_placement[currPlacement]),
                        end: this.getPointCoords(this.filters.trajectories[side].return_type[value], this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy)
                    };

                    this.addTrajectory(side, coords, 'in-' + currPlacement + '-' + value);
                    this.removeTrajectory(side, 'in-' + currPlacement + '-df');

                    //commentato, sarà utile per il return
                    // if (this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {
                    //     coords = {
                    //         start: this.getPointCoords(this.filters.trajectories[side].return_type[value], this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy),
                    //         middle: this.getPointCoords(this.filters.trajectories[side].serve_outcome.fault.df),
                    //         // @ts-ignore
                    //         end: false
                    //     };
                    //     this.addTrajectory(side, coords, 'fault-' + value + '-df');
                    //     this.removeTrajectory(side, 'fault-df-df');
                    // }

                } else if (field === 'return_contact' || field === 'return_contact_depth') {

                    if (!this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id')) {

                        this.filtersSelected.common.serve_outcome.values.push(this.generalService.findIntoArrayofObject('in', serve_outcome.values, 'id'));

                        const coords = {
                            start: this.getPointCoords(this.filters.trajectories[side].serve_side),
                            middle: this.getPointCoords(this.filters.trajectories[side].serve_placement.df),
                            end: this.getPointCoords(this.filters.trajectories[side].return_type.df, this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy)
                        };
                        this.addTrajectory(side, coords, 'in-df-df');

                    }
                }
            }

            // AGGIORNO LA CRONOLOGIA DEI FILTRI ATTIVATI
            this.simulationFiltersHistory = this.filtersService.setFiltersHistory(this.simulationFiltersHistory, 'field', this.fieldSelected[side].filters[field], side);
            this.dataExchangeService.setSimulationFiltersHistoryData(this.simulationFiltersHistory);
        });

        this.checkTrajectories();

        // UPDATE SELECTED FILTERS
        this.updateSelectedFiltersData(field, value, sides);
    }

    updateSelectedFiltersData(field, value, sides) {

        // tslint:disable-next-line:variable-name
        const serve_side = this.generalService.findIntoArrayofObject('serve_side', this.filters.common, 'id');

        /*this.filtersSelected.field = {
            ad: {},
            deuce: {}
        };*/

        /*serve_side.values.forEach((side) => {
            this.filtersSelected.field[side.id] = {...this.fieldSelected[side.id].filters};
        });*/

        serve_side.values.forEach((side) => {
            Object.keys(this.fieldSelected[side.id].filters).forEach((item) => {
                this.filtersSelected.field[side.id][item].values = [...this.fieldSelected[side.id].filters[item].values];
            });
        });

        this.initEnableFieldSelectedData();
        this.initValidateFieldSelectedData();

        this.checkFieldSelectedData();
        this.checkTrajectories();

        this.getMatches().subscribe((response) => {

            // ASSEGNO I RISULTATI DEI REPORT
            if (response.data.report) {
                this.resultsData.report = {...response.data.report};
            }

            // ASSEGNO I RISULTATI DEI MATCH
            if (response.data.match) {
                this.resultsData.match = [...response.data.match];
            }

            // @ts-ignore
            if (response.data.smartdata) {

                // @ts-ignore SE IL FORM È VALIDO GENERO I RISULTATI
                this.resultsData.smartdata = {...response.data.smartdata};

                if (this.resultsData.smartdata[this.filtersSelected.smartdata.type[0].id].length) {

                    this.formData.isValid = true;

                    this.resultsData.smartdata[this.filtersSelected.smartdata.type[0].id] = this.generalService.sortArrayOfObject(this.resultsData.smartdata[this.filtersSelected.smartdata.type[0].id], 'counts', -1);

                } else {

                    this.formData.isValid = false;

                    // IMPOSTO L'ERRORE SUL CAMPO SELEZIONATO
                    if (this.validateFieldSelected.hasOwnProperty(field)) {
                        this.validateFieldSelected[field] = false;
                    } else {
                        sides.forEach((side) => {
                            if (value) {
                                this.validateFieldSelected[side][field][value] = false;
                            } else {
                                this.validateFieldSelected[side][field] = false;
                            }
                        });
                    }
                }
            }

            this.resultsData.filters = {...this.filtersSelected};
            this.dataExchangeService.setResultsData(this.resultsData);

        }, (error) => {

            this.formData.isValid = false;

            // IMPOSTO L'ERRORE SUL CAMPO SELEZIONATO
            if (this.validateFieldSelected.hasOwnProperty(field)) {
                this.validateFieldSelected[field] = false;
            } else {
                sides.forEach((side) => {
                    if (value) {
                        this.validateFieldSelected[side][field][value] = false;
                    } else {
                        this.validateFieldSelected[side][field] = false;
                    }
                });
            }

            this.resultsData.filters = {...this.filtersSelected};
            Object.keys(this.resultsData.smartdata).forEach((key) => {
                this.resultsData.smartdata[key] = [];
            });
            this.dataExchangeService.setResultsData(this.resultsData);
        });
    }

    onInsightSelect(side, type) {
        this.insightSelected.side = side;
        if (type === 'serve_placement') {
            this.insightSelected.type = {
                id: 'serve_placement',
                itemName: 'Serve placement'
            };
        } else if (type === 'return_contact') {
            this.insightSelected.type = {
                id: 'return_contact',
                itemName: 'Return contact'
            };
        } else if (type === 'return_contact_depth') {
            this.insightSelected.type = {
                id: 'return_contact_depth',
                itemName: 'Return contact depth'
            };
        }
    }

    onInsightClose() {
        this.initInsightSelectedData();
    }

    onStatsUpdate(data) {
        this.statsSelected[data.side] = data;
    }

    addToReport() {

        const simulationData = {
            type: 'smartdata',
            elements: {}
        };

        simulationData.elements = {
            field: this.tennisField.nativeElement.innerHTML,
            stats: {
                ad: '',
                deuce: ''
            }
        };

        if (this.generalService.findIntoArrayofObject('ad', this.filtersSelected.common.serve_side.values, 'id')) {
            // @ts-ignore
            simulationData.elements.stats.ad = this.tennisFieldStatsAd.nativeElement.innerHTML;
        }
        if (this.generalService.findIntoArrayofObject('deuce', this.filtersSelected.common.serve_side.values, 'id')) {
            // @ts-ignore
            simulationData.elements.stats.deuce = this.tennisFieldStatsDeuce.nativeElement.innerHTML;
        }

        this.report[0].type = 'custom';
        setTimeout(() => {
            this.dataExchangeService.setSimulationData(simulationData);
            this.modeSelectedEmit.emit();
        }, 300);
    }

    checkFieldSelectedData() {

        // CONTROLLO I SERVE_SIDE SELEZIONATI
        if (this.filtersSelected.common.serve_side.values.length === 1) {
            if (this.filtersSelected.common.serve_side.values[0].id === 'ad') {
                this.enableFieldSelected.deuce.return_contact.a = false;
                this.enableFieldSelected.deuce.return_contact.b = false;
                this.enableFieldSelected.deuce.serve_placement.s1 = false;
                this.enableFieldSelected.deuce.serve_placement.s2 = false;
                this.enableFieldSelected.deuce.serve_placement.s3 = false;
                this.enableFieldSelected.deuce.serve_placement.s4 = false;
            }
            if (this.filtersSelected.common.serve_side.values[0].id === 'deuce') {
                this.enableFieldSelected.ad.return_contact.c = false;
                this.enableFieldSelected.ad.return_contact.d = false;
                this.enableFieldSelected.ad.serve_placement.s5 = false;
                this.enableFieldSelected.ad.serve_placement.s6 = false;
                this.enableFieldSelected.ad.serve_placement.s7 = false;
                this.enableFieldSelected.ad.serve_placement.s8 = false;
            }
        }

        // CONTROLLO I SERVE_PLACEMENT SELEZIONATI
        if (this.fieldSelected.ad.filters.hasOwnProperty('serve_placement')) {
            if (this.generalService.findIntoArrayofObject('s5', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('s6', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('s7', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                if (this.fieldSelected.ad.filters.hasOwnProperty('return_type') && this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
                    this.enableFieldSelected.ad.return_contact.c = false;
                }
            } else if (this.generalService.findIntoArrayofObject('s8', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                this.enableFieldSelected.ad.return_contact.c = false;
            }
        }
        if (this.fieldSelected.deuce.filters.hasOwnProperty('serve_placement')) {
            if (this.generalService.findIntoArrayofObject('s1', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                this.enableFieldSelected.deuce.return_contact.b = false;
            } else if (this.generalService.findIntoArrayofObject('s2', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                if (this.fieldSelected.deuce.filters.hasOwnProperty('return_type') && this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
                    this.enableFieldSelected.deuce.return_contact.b = false;
                }
            } else if (this.generalService.findIntoArrayofObject('s3', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('s4', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
            }
        }

        // CONTROLLO I RETURN_CONTACT SELEZIONATI
        if (this.fieldSelected.ad.filters.hasOwnProperty('return_contact')) {
            if (this.generalService.findIntoArrayofObject('c', this.fieldSelected.ad.filters.return_contact.values, 'id')) {
                this.enableFieldSelected.ad.serve_placement.s8 = false;
                if (this.fieldSelected.ad.filters.hasOwnProperty('serve_placement') && this.generalService.findIntoArrayofObject('s7', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                    this.enableFieldSelected.ad.return_type.forehand_return = false;
                }
                if (this.fieldSelected.ad.filters.hasOwnProperty('return_type') && this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
                    this.enableFieldSelected.ad.serve_placement.s7 = false;
                }
            } else if (this.generalService.findIntoArrayofObject('d', this.fieldSelected.ad.filters.return_contact.values, 'id')) {
            }
        }
        if (this.fieldSelected.deuce.filters.hasOwnProperty('return_contact')) {
            if (this.generalService.findIntoArrayofObject('a', this.fieldSelected.deuce.filters.return_contact.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('b', this.fieldSelected.deuce.filters.return_contact.values, 'id')) {
                this.enableFieldSelected.deuce.serve_placement.s1 = false;
                if (this.fieldSelected.deuce.filters.hasOwnProperty('serve_placement') && this.generalService.findIntoArrayofObject('s2', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                    this.enableFieldSelected.deuce.return_type.backhand_return = false;
                }
                if (this.fieldSelected.deuce.filters.hasOwnProperty('return_type') && this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
                    this.enableFieldSelected.deuce.serve_placement.s2 = false;
                }
            }
        }

        // CONTROLLO I RETURN_CONTACT_DEPTH SELEZIONATI
        if (this.fieldSelected.ad.filters.hasOwnProperty('return_contact_depth')) {
            if (this.generalService.findIntoArrayofObject('z1', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z2', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z3', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z4', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z5', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
            }
        }
        if (this.fieldSelected.deuce.filters.hasOwnProperty('return_contact_depth')) {
            if (this.generalService.findIntoArrayofObject('z1', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z2', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z3', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z4', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
            } else if (this.generalService.findIntoArrayofObject('z5', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
            }
        }

        // CONTROLLO I RETURN_TYPE SELEZIONATI
        if (this.fieldSelected.ad.filters.hasOwnProperty('return_type') && this.fieldSelected.ad.filters.return_type.values.length === 1) {
            if (this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
                if (this.fieldSelected.ad.filters.hasOwnProperty('return_contact') && this.generalService.findIntoArrayofObject('c', this.fieldSelected.ad.filters.return_contact.values, 'id')) {
                    this.enableFieldSelected.ad.serve_placement.s7 = false;
                }
            }
            if (this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
            }
        }
        if (this.fieldSelected.deuce.filters.hasOwnProperty('return_type') && this.fieldSelected.deuce.filters.return_type.values.length === 1) {
            if (this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
            }
            if (this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
                if (this.fieldSelected.deuce.filters.hasOwnProperty('return_contact') && this.generalService.findIntoArrayofObject('b', this.fieldSelected.deuce.filters.return_contact.values, 'id')) {
                    this.enableFieldSelected.deuce.serve_placement.s2 = false;
                }
            }
        }
    }

    checkTrajectories() {

        if (this.fieldSelected.ad.filters.hasOwnProperty('return_type') && this.fieldSelected.ad.filters.return_type.values.length === 2) {
            this.fieldSelected.ad.player_2.offx = 0;
        }
        if (this.fieldSelected.deuce.filters.hasOwnProperty('return_type') && this.fieldSelected.deuce.filters.return_type.values.length === 2) {
            this.fieldSelected.deuce.player_2.offx = 0;
        }

        // CONTROLLO I SERVE_SIDE
        if (this.filtersSelected.common.serve_side.values.length === 1) {
            if (this.filtersSelected.common.serve_side.values[0].id === 'ad') {
            }
            if (this.filtersSelected.common.serve_side.values[0].id === 'deuce') {
            }
        }

        // CONTROLLO I SERVE_PLACEMENT
        if (this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id')) {

            if (this.fieldSelected.ad.filters.hasOwnProperty('serve_placement')) {
                if (this.generalService.findIntoArrayofObject('s5', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx = -50;
                } else if (this.generalService.findIntoArrayofObject('s6', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx = -20;
                } else if (this.generalService.findIntoArrayofObject('s7', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx = 0;
                } else if (this.generalService.findIntoArrayofObject('s8', this.fieldSelected.ad.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx = 20;
                }
            }
            if (!this.fieldSelected.ad.filters.hasOwnProperty('serve_placement') || (this.fieldSelected.ad.filters.hasOwnProperty('serve_placement') && !this.fieldSelected.ad.filters.serve_placement.values.length)) {
                this.fieldSelected.ad.player_2.offx = 0;
            }
            if (this.fieldSelected.deuce.filters.hasOwnProperty('serve_placement')) {
                if (this.generalService.findIntoArrayofObject('s1', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx = -20;
                } else if (this.generalService.findIntoArrayofObject('s2', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx = 0;
                } else if (this.generalService.findIntoArrayofObject('s3', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx = 20;
                } else if (this.generalService.findIntoArrayofObject('s4', this.fieldSelected.deuce.filters.serve_placement.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx = 50;
                }
            }
            if (!this.fieldSelected.deuce.filters.hasOwnProperty('serve_placement') || (this.fieldSelected.deuce.filters.hasOwnProperty('serve_placement') && !this.fieldSelected.deuce.filters.serve_placement.values.length)) {
                this.fieldSelected.deuce.player_2.offx = 0;
            }

            // CONTROLLO I RETURN_CONTACT
            if (this.fieldSelected.ad.filters.hasOwnProperty('return_contact')) {
                // this.fieldSelected.ad.player_2.x = this.filters.player.player_2.x[this.fieldSelected.ad.filters.return_contact.values[0].id];
                if (this.generalService.findIntoArrayofObject('c', this.fieldSelected.ad.filters.return_contact.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('d', this.fieldSelected.ad.filters.return_contact.values, 'id')) {
                }
            }
            if (this.fieldSelected.deuce.filters.hasOwnProperty('return_contact')) {
                // this.fieldSelected.deuce.player_2.x = this.filters.player.player_2.x[this.fieldSelected.deuce.filters.return_contact.values[0].id];
                if (this.generalService.findIntoArrayofObject('a', this.fieldSelected.deuce.filters.return_contact.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('b', this.fieldSelected.deuce.filters.return_contact.values, 'id')) {
                }
            }

            // CONTROLLO I RETURN_CONTACT_DEPTH SELEZIONATI
            if (this.fieldSelected.ad.filters.hasOwnProperty('return_contact_depth')) {
                if (this.generalService.findIntoArrayofObject('z1', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z2', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z3', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z4', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z5', this.fieldSelected.ad.filters.return_contact_depth.values, 'id')) {
                }
            }
            if (this.fieldSelected.deuce.filters.hasOwnProperty('return_contact_depth')) {
                if (this.generalService.findIntoArrayofObject('z1', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z2', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z3', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z4', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
                } else if (this.generalService.findIntoArrayofObject('z5', this.fieldSelected.deuce.filters.return_contact_depth.values, 'id')) {
                }
            }

            // CONTROLLO I RETURN_TYPE
            if (this.fieldSelected.ad.filters.hasOwnProperty('return_type') && this.fieldSelected.ad.filters.return_type.values.length === 1) {
                if (this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx += 40;
                }
                if (this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.ad.filters.return_type.values, 'id')) {
                    this.fieldSelected.ad.player_2.offx += -40;
                }
            }
            if (this.fieldSelected.deuce.filters.hasOwnProperty('return_type') && this.fieldSelected.deuce.filters.return_type.values.length === 1) {
                if (this.generalService.findIntoArrayofObject('forehand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx += 40;
                }
                if (this.generalService.findIntoArrayofObject('backhand_return', this.fieldSelected.deuce.filters.return_type.values, 'id')) {
                    this.fieldSelected.deuce.player_2.offx += -40;
                }
            }
        } else {
            this.fieldSelected.ad.player_2.offx = 0;
            this.fieldSelected.deuce.player_2.offx = 0;
        }

        // UPDATE TRAJECTORIES
        ['ad', 'deuce'].forEach((side) => {
            this.fieldSelected[side].trajectory.forEach((trajectory, i) => {
                const trajectoryId = trajectory.id.split('-');
                if (trajectoryId[0] === 'in') {
                    this.editTrajectory(side, trajectory.id, 'end', this.getPointCoords(this.filters.trajectories[side].return_type[trajectoryId[2]], this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy));
                }
                // commentato, sarà utile per il return
                // else if (trajectoryId[0] === 'fault') {
                //     this.editTrajectory(side, trajectory.id, 'start', this.getPointCoords(this.filters.trajectories[side].return_type[trajectoryId[1]], this.fieldSelected[side].player_2.x + this.fieldSelected[side].player_2.offx, this.fieldSelected[side].player_2.y + this.fieldSelected[side].player_2.offy));
                // }
            });
        });
    }

    // INIT UTILITY
    addTrajectory(side, coords, id) {

        const trajectory = {
            // @ts-ignore
            id: id,
            start: coords.start,
            middle: coords.middle,
            end: coords.end,
            control: {
                c1: {
                    x: 0,
                    y: 0
                },
                c2: {
                    x: 0,
                    y: 0
                }
            }
        };

        trajectory.control = this.calculateTrajectory(side, trajectory.start, trajectory.middle, trajectory.end);
        this.removeTrajectory(side, id);
        this.fieldSelected[side].trajectory.push(trajectory);
    }

    editTrajectory(side, id, point, coords) {

        const currPlacement = (this.fieldSelected[side].filters.hasOwnProperty('serve_placement') && this.fieldSelected[side].filters.serve_placement.values.length) ? this.fieldSelected[side].filters.serve_placement.values[0].id  : 'df';

        if (Array.isArray(id)) {

            const trajectories = (!id.length) ? [...this.fieldSelected[side].trajectory] : this.generalService.findIntoArrayofObject(id, this.fieldSelected[side].trajectory, 'id');

            trajectories.forEach((trajectory) => {

                const oldId = trajectory.id.split('-');
                let newId = '';

                trajectory[point] = coords;
                trajectory.control = this.calculateTrajectory(side, trajectory.start, trajectory.middle, trajectory.end);

                this.removeTrajectory(side, trajectory.id);

                if (point === 'middle') {
                    if (oldId[0] === 'ace') {
                        newId = oldId[0] + '-' + currPlacement + '-' + currPlacement;
                    } else {
                        newId = oldId[0] + '-' + currPlacement + '-' + oldId[2];
                    }
                } else if (point === 'end') {
                    if (oldId[0] === 'ace' && !coords) {
                        newId = oldId[0] + '-' + currPlacement + '-nd';
                    }
                }
                trajectory.id = (newId) ? newId : trajectory.id;
                this.fieldSelected[side].trajectory.push(trajectory);
            });

        } else {

            this.fieldSelected[side].trajectory.forEach((trajectory) => {
                if (trajectory.id.indexOf(id) !== -1) {

                    const oldId = trajectory.id.split('-');
                    let newId = '';

                    trajectory[point] = coords;
                    trajectory.control = this.calculateTrajectory(side, trajectory.start, trajectory.middle, trajectory.end);

                    this.removeTrajectory(side, trajectory.id);

                    if (point === 'middle') {
                        if (oldId[0] === 'ace') {
                            newId = oldId[0] + '-' + currPlacement + '-' + currPlacement;
                        } else {
                            newId = oldId[0] + '-' + currPlacement + '-' + oldId[2];
                        }
                    } else if (point === 'end') {
                        if (oldId[0] === 'ace') {
                            if (!coords) {
                                newId = oldId[0] + '-' + currPlacement + '-nd';
                            }
                        }
                    }
                    trajectory.id = (newId) ? newId : trajectory.id;
                    this.fieldSelected[side].trajectory.push(trajectory);
                }
            });
        }
    }

    removeTrajectory(side, id) {
        this.fieldSelected[side].trajectory = this.generalService.removeObjectFromArray(id, this.fieldSelected[side].trajectory, 'id');
    }

    calculateTrajectory(side, start, middle, end) {

        const control = {
            c1: {
                x: 0,
                y: 0
            },
            c2: {
                x: 0,
                y: 0
            }
        };

        // tslint:disable-next-line:one-variable-per-declaration
        let mp1x, mp1y, mp2x, mp2y, theta1, theta2, offset;

        // mid-point of line:
        mp1x = (middle.x + start.x) * 0.5;
        mp1y = (middle.y + start.y) * 0.5;
        if (end) {
            mp2x = (end.x + middle.x) * 0.5;
            mp2y = (end.y + middle.y) * 0.5;
        }

        // angle of perpendicular to line:
        theta1 = Math.atan2(middle.y - start.y, middle.x - start.x) - Math.PI / 2;
        if (end) {
            theta2 = Math.atan2(end.y - middle.y, end.x - middle.x) - Math.PI / 2;
        }

        // distance of control point from mid-point of line:
        offset = (side === 'ad') ? 20 : -20;

        // location of control point:
        control.c1.x = mp1x + offset * Math.cos(theta1);
        control.c1.y = mp1y + offset * Math.sin(theta1);
        if (end) {
            control.c2.x = mp2x + offset * Math.cos(theta2);
            control.c2.y = mp2y + offset * Math.sin(theta2);
        }

        return control;
    }

    getPointCoords(element, offsetX = 0, offsetY = 0) {
        const coords = {
            x: (element && element.attributes) ? parseFloat(element.attributes.cx.nodeValue) + offsetX : 0,
            y: (element && element.attributes) ? parseFloat(element.attributes.cy.nodeValue) + offsetY : 0
        };
        return coords;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('modeSelected') && changes.modeSelected.currentValue === 'select') {
            if (!this.insightSelected.type.id) {
                this.addToReport();
            }
        }
    }

    ngOnInit() {

        // tslint:disable-next-line:variable-name
        let serve_side;
        // tslint:disable-next-line:variable-name
        let serve_outcome;

        this.initFormData();
        this.initEnableFieldSelectedData();
        this.initValidateFieldSelectedData();

        this.initInsightSelectedData();
        if (!this.simulationFiltersHistory) {
            this.initSimulationFiltersHistoryData();
        }

        if (!this.filters) {
            this.initFiltersData('common');
            serve_side = this.generalService.findIntoArrayofObject('serve_side', this.filters.common, 'id');
            serve_outcome = this.generalService.findIntoArrayofObject('serve_outcome', this.filters.common, 'id');
        }

        if (!this.fieldSelected) {
            this.initSelectedFieldData();
        }

        if (!this.statsSelected) {
            this.initStatsSelectedData();
        }

        this.dataExchangeService.reportSelected.subscribe((report) => {
            this.report = [...report];
        });

        this.dataExchangeService.resultsData.subscribe((results) => {

            this.resultsData = {...results};
            delete this.resultsData.filters;

            this.filtersSelected = results.filters;

            if (this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length && this.filtersSelected.smartdata.type.length && this.tennisField) {

                serve_side.values.forEach((side) => {

                    const currPlacement = (this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') && this.fieldSelected[side.id].filters.serve_placement.values.length) ? this.fieldSelected[side.id].filters.serve_placement.values[0].id  : 'df';

                    if (!this.generalService.findIntoArrayofObject(side.id, this.filtersSelected.common.serve_side.values, 'id') || !this.filtersSelected.common.serve_side.values.length) {

                        this.filtersSelected.common.serve_side.values = this.generalService.removeObjectFromArray(side.id, this.filtersSelected.common.serve_side.values, 'id');

                        if (!this.filtersSelected.common.serve_side.values.length) {
                            this.filtersSelected.common.serve_outcome.values = [];
                            if (this.simulationFiltersHistory) {
                                this.simulationFiltersHistory = this.filtersService.setFiltersHistory(this.simulationFiltersHistory, 'common', this.filtersSelected.common.serve_outcome);
                            }
                        }

                        this.fieldSelected[side.id].filters = {};

                        this.fieldSelected[side.id].player_2.x = this.filters.player.player_2.x[side.id];
                        this.fieldSelected[side.id].player_2.y = this.filters.player.player_2.y.z4;

                        this.fieldSelected[side.id].trajectory = [];

                        if (!this.filtersSelected.common.serve_side.values.length && this.simulationFiltersHistory) {
                            this.simulationFiltersHistory = this.simulationFiltersHistory.filter((history) => {
                                return history.side !== side.id;
                            });
                            this.dataExchangeService.setSimulationFiltersHistoryData(this.simulationFiltersHistory);
                        }

                    } else if (this.generalService.findIntoArrayofObject(side.id, this.filtersSelected.common.serve_side.values, 'id')) {

                        let trajecotyAce = false;
                        let trajecotyIn = false;
                        let trajecotyFault = false;
                        this.fieldSelected[side.id].trajectory.forEach((trajectory) => {
                            if (trajectory.id.indexOf('ace-') !== -1) {
                                trajecotyAce = true;
                            }
                            if (trajectory.id.indexOf('in-') !== -1) {
                                trajecotyIn = true;
                            }
                            if (trajectory.id.indexOf('fault-') !== -1) {
                                trajecotyFault = true;
                            }
                        });

                        if (!trajecotyAce && this.generalService.findIntoArrayofObject('ace', this.filtersSelected.common.serve_outcome.values, 'id')) {

                            this.checkTrajectories();

                            if (!this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id') &&
                                (!this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') || (this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') && !this.fieldSelected[side.id].filters.serve_placement.values.length))) {

                                // INIT TRAJECTORY
                                const coords = {
                                    start: this.getPointCoords(this.filters.trajectories[side.id].serve_side),
                                    middle: this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.df),
                                    end: false
                                };
                                this.addTrajectory(side.id, coords, 'ace-' + currPlacement + '-nd');

                            } else {

                                this.checkTrajectories();
                                this.removeTrajectory(side.id, 'ace-' + currPlacement + '-nd');

                                // INIT TRAJECTORY
                                const coords = {
                                    start: this.getPointCoords(this.filters.trajectories[side.id].serve_side),
                                    middle: this.getPointCoords(this.filters.trajectories[side.id].serve_placement.df),
                                    end: (side.id === 'ad') ? this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s8) : this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s1)
                                };

                                if (this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') && this.fieldSelected[side.id].filters.serve_placement.values.length) {
                                    coords.middle = this.getPointCoords(this.filters.trajectories[side.id].serve_placement[this.fieldSelected[side.id].filters.serve_placement.values[0].id]);
                                    coords.end = this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace[currPlacement]);
                                }

                                this.addTrajectory(side.id, coords, 'ace-' + currPlacement + '-' + currPlacement);
                            }

                        } else if (trajecotyAce && !this.generalService.findIntoArrayofObject('ace', this.filtersSelected.common.serve_outcome.values, 'id')) {

                            this.checkTrajectories();

                            this.fieldSelected[side.id].trajectory.forEach((trajectory) => {
                                const trajectoryId = trajectory.id.split('-');
                                if (trajectoryId[0] === 'ace') {
                                    this.removeTrajectory(side.id, trajectory.id);
                                }
                            });
                        }

                        if (!trajecotyIn && this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id') ) { // sarà utile per il return || !trajecotyIn && !trajecotyFault && this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')

                            this.checkTrajectories();

                            // INIT TRAJECTORY
                            const coords = {
                                start: this.getPointCoords(this.filters.trajectories[side.id].serve_side),
                                middle: this.getPointCoords(this.filters.trajectories[side.id].serve_placement[currPlacement]),
                                end: this.getPointCoords(this.filters.trajectories[side.id].return_type.df, this.fieldSelected[side.id].player_2.x + this.fieldSelected[side.id].player_2.offx, this.fieldSelected[side.id].player_2.y + this.fieldSelected[side.id].player_2.offy)
                            };
                            this.addTrajectory(side.id, coords, 'in-' + currPlacement + '-df');

                            /*if (!this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') || (this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') && !this.fieldSelected[side.id].filters.serve_placement.values.length && !this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id'))) {
                                this.editTrajectory(side.id, 'ace-', 'end', false);
                            } else {
                                coords.end = (side.id === 'ad') ? this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s8) : this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s1)
                                this.editTrajectory(side.id, 'ace-', 'end', coords.end);
                            }*/

                            if (this.generalService.findIntoArrayofObject('ace', this.filtersSelected.common.serve_outcome.values, 'id') && this.generalService.findIntoArrayofObject('ace-df-nd', this.fieldSelected.deuce.trajectory, 'id')) {
                                coords.end = (side.id === 'ad') ? this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s8) : this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.ace.s1);
                                this.removeTrajectory(side.id, 'ace-df-nd');
                                this.addTrajectory(side.id, coords, 'ace-' + currPlacement + '-df');
                            }

                        } else if (trajecotyIn && !this.generalService.findIntoArrayofObject('in', this.filtersSelected.common.serve_outcome.values, 'id') ) { //sarà utile per il return && !this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')

                            this.checkTrajectories();

                            this.fieldSelected[side.id].trajectory.forEach((trajectory) => {
                                const trajectoryId = trajectory.id.split('-');
                                if (trajectoryId[0] === 'in') {
                                    this.removeTrajectory(side.id, trajectory.id);
                                }
                            });

                            if (this.generalService.findIntoArrayofObject('ace', this.filtersSelected.common.serve_outcome.values, 'id') && (!this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') || (this.fieldSelected[side.id].filters.hasOwnProperty('serve_placement') && !this.fieldSelected[side.id].filters.serve_placement.values.length))) { //sarà utile per il return && !this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')
                                this.editTrajectory(side.id, 'ace-', 'end', false);
                            }

                            if (this.fieldSelected[side.id].filters.hasOwnProperty('return_type')) {
                                this.fieldSelected[side.id].filters.return_type.values = [];
                            }
                        }

                        // if (!trajecotyFault && this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {

                        //     this.checkTrajectories();

                        //     if (this.fieldSelected[side.id].filters.hasOwnProperty('return_type') && this.fieldSelected[side.id].filters.return_type.values.length) {
                        //         // tslint:disable-next-line:variable-name
                        //         this.fieldSelected[side.id].filters.return_type.values.forEach((return_type) => {
                        //             // INIT TRAJECTORY
                        //             const coords = {
                        //                 start: this.getPointCoords(this.filters.trajectories[side.id].return_type[return_type.id], this.fieldSelected[side.id].player_2.x + this.fieldSelected[side.id].player_2.offx, this.fieldSelected[side.id].player_2.y + this.fieldSelected[side.id].player_2.offy),
                        //                 middle: this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.fault.df),
                        //                 end: false
                        //             };
                        //             this.addTrajectory(side.id, coords, 'fault-' + return_type.id + '-df');
                        //         });
                        //     } else {
                        //         // INIT TRAJECTORY
                        //         const coords = {
                        //             start: this.getPointCoords(this.filters.trajectories[side.id].return_type.df, this.fieldSelected[side.id].player_2.x + this.fieldSelected[side.id].player_2.offx, this.fieldSelected[side.id].player_2.y + this.fieldSelected[side.id].player_2.offy),
                        //             middle: this.getPointCoords(this.filters.trajectories[side.id].serve_outcome.fault.df),
                        //             end: false
                        //         };
                        //         this.addTrajectory(side.id, coords, 'fault-df-df');
                        //     }

                        // } else if (trajecotyFault && !this.generalService.findIntoArrayofObject('fault', this.filtersSelected.common.serve_outcome.values, 'id')) {

                        //     this.checkTrajectories();

                        //     this.fieldSelected[side.id].trajectory.forEach((trajectory) => {
                        //         const trajectoryId = trajectory.id.split('-');
                        //         if (trajectoryId[0] === 'fault') {
                        //             this.removeTrajectory(side.id, trajectory.id);
                        //         }
                        //     });
                        // }
                    }

                });

            } else {

                this.initSelectedFieldData();
            }
        });

        // collego la history dei filtri sul campo
        this.dataExchangeService.simulationFiltersHistory.subscribe((history) => {
            this.simulationFiltersHistory = (history) ? history : [];
        });

        this.dataExchangeService.fullScreen.subscribe(val => {
            this.fullScreen = val;
        });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit() {
        this.initFiltersData('trajectories');
    }
}
