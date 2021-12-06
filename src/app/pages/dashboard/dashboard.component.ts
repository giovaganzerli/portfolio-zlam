import {Component, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { jsPDF } from "jspdf";
import * as html2canvas from 'html2canvas';

// SERVICES
import { AuthService } from '../../services/auth/auth.service';
import { GeneralService } from '../../services/general/general.service';
import { DatasetService } from '../../services/dataset/dataset.service';
import { FiltersService } from '../../services/filters/filters.service';
import { SmartdataService } from '../../services/smartdata/smartdata.service';
import { ReportService } from '../../services/report/report.service';
import { DataExchangeService } from '../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    syncDatasets;
    syncReports;
    addSection: boolean;
    fullScreen: boolean;

    // INIT DATA
    user;
    formData;
    dataset;
    filters;
    report;
    simulationFiltersHistory;

    // INIT SELECTED DATA
    datasetSelected;
    filtersSelected;
    reportSelected;

    // INIT VALIDATE DATA
    validateFiltersSelected;

    // INIT DATEPICKER
    datepickerOptions = {
        dateRange: false,
        dateFormat: 'yyyy/mm/dd',
        todayTxt: 'TODAY',
        minYear: 1000,
        maxYear: 9999,
        monthSelector: true,
        yearSelector: true,
        disableHeaderButtons: false,
        disableDateRanges: [
            {
                begin: {
                    year: moment().format('YYYY'),
                    month: moment().format('M'),
                    day: moment().format('D')
                },
                end: {
                    year: 9999,
                    month: 12,
                    day: 31
                }
            }
        ],
        enableDates: []
    };

    // INIT MULTISELECT
    multiselectOptions = {
        filter_player_1: {
            singleSelection: true,
            enableSearchFilter: true,
            badgeShowLimit: 1,
            text: 'Select Reference Player',
            classes: 'select-advanced is-size-7'
        },
        filter_player_2: {
            singleSelection: false,
            enableSearchFilter: true,
            badgeShowLimit: 1,
            text: 'Select Opponent Player',
            classes: 'select-advanced is-size-7'
        },
        filter_tournament_name: {
            singleSelection: false,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: 'Type',
            classes: 'select-advanced is-size-7'
        },
        filter_match_round: {
            singleSelection: false,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: 'Round',
            classes: 'select-advanced is-size-7'
        },
        filter_tournament_surface: {
            singleSelection: false,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: 'Surface',
            classes: 'select-advanced is-size-7'
        },
        filter_tournament_env: {
            singleSelection: false,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: 'Condition',
            classes: 'select-advanced is-size-7'
        },
        filter_common: {
            singleSelection: false,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_points_player_1: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_points_player_1_tie: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_points_player_2: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_points_player_2_tie: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_game_player_1: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_game_player_2: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_set_player_1: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        filter_score_set_player_2: {
            singleSelection: true,
            enableSearchFilter: false,
            badgeShowLimit: 1,
            text: '--',
            classes: 'select-advanced is-size-7'
        },
        dataset_data: {
            singleSelection: false,
            enableSearchFilter: false,
            selectAllText: 'Add All',
            unSelectAllText: 'Remove All',
            badgeShowLimit: 1,
            text: 'Select dataset',
            classes: 'select-advanced is-size-7',
            primaryKey: 'id',
            labelKey: 'itemName',
            searchBy: [ 'itemName', 'description' ]
        },
        report_data: {
            singleSelection: true,
            enableSearchFilter: false,
            selectAllText: 'Add All',
            unSelectAllText: 'Remove All',
            badgeShowLimit: 1,
            text: 'Select report',
            classes: 'select-advanced is-size-7',
            primaryKey: 'id',
            labelKey: 'itemName',
            searchBy: [ 'itemName' ],
            position: 'bottom'
        }
    };

    // INIT MODALAS
    modals = {
        uploadsDataset: false,
        playersAdvancedSelect: false
    };

    constructor(
        private router: Router,
        private authService: AuthService,
        public generalService: GeneralService,
        private datasetService: DatasetService,
        private filtersService: FiltersService,
        private smartdataService: SmartdataService,
        private reportService: ReportService,
        private dataExchangeService: DataExchangeService
    ) {

        this.syncDatasets = false;

        // INIT DATA
        this.initUserData();
        this.initFormData();
        this.initDatasetData();
        this.initFiltersData();
        this.initReportData();

        // INIT SELECTED DATA
        this.initSelectedDatasetData();
        this.initSelectedFiltersData();
        this.initSelectedReportData();

        // INIT VALIDATION DATA
        this.initValidateFiltersSelectedData();
    }

    // INIT DATA

    initUserData() {
        this.user = this.getUser();
    }

    initFormData() {
        this.formData = {
            isValid: false,
            message: '',
            results: {
                filters: false,
                match: [],
                smartdata: false,
                report: false
            }
        };
    }

    initDatasetData() {
        this.dataset = [];
    }

    initFiltersData(type = 'all') {
        if (type === 'all') {
            this.filters = {
                player: {
                    player_1: [],
                    player_2: [],
                    all: []
                },
                match: {
                    round: [],
                    date: []
                },
                tournament: {
                    name: [],
                    surface: [],
                    env: []
                },
                field: [],
                common: [],
                score: {
                    points: {
                        player_1: [],
                        player_1_tie: [],
                        player_2: [],
                        player_2_tie: [],
                    },
                    game: {
                        player_1: [],
                        player_2: []
                    },
                    set: {
                        player_1: [],
                        player_2: []
                    }
                },
                smartdata: {
                    type: this.getSmartdataTypes(),
                    aggregation: []
                }
            };
        }

        if (type === 'smartdata') {
            this.filters.smartdata.type = this.getSmartdataTypes();
        }

        if (type === 'smartdata-filters-common') {
            this.filters.common = [];
        }

        if (type === 'smartdata-filters-field' || type === 'all') {
            this.filters.field = [];
        }
    }

    initReportData() {
        this.report = [
            {
                id: 0,
                itemName: 'Nuovo Report',
                type: '',
                data: {
                    basic: [],
                    alert: [],
                    kpis: [],
                    ta: [],
                    custom: []
                }
            }
        ];
    }

    // INIT SELECTED DATA

    initSelectedDatasetData() {
        this.datasetSelected = [];
    }

    initSelectedFiltersData(type = 'all') {

        if (!this.filtersSelected) {
            this.filtersSelected = {
                player: {
                    player_1: [],
                    player_2: [],
                    against_all: false
                },
                match: {
                    round: [],
                    date: {
                        from: false,
                        to: false
                    }
                },
                tournament: {
                    name: [],
                    surface: [],
                    env: []
                },
                common: {},
                specific: {
                    in: false,
                    out: false,
                    net: false,
                    let: false
                },
                score: {
                    points: {
                        player_1: '',
                        player_1_tie: '',
                        player_2: '',
                        player_2_tie: ''
                    },
                    game: {
                        player_1: '',
                        player_2: ''
                    },
                    set: {
                        player_1: '',
                        player_2: ''
                    }
                },
                field: {
                    ad: {},
                    deuce: {}
                },
                smartdata: {
                    type: [],
                    aggregation: []
                }
            };
        }

        if (type === 'filters' || type === 'all') {
            this.filtersSelected.player = {
                player_1: [],
                player_2: [],
                against_all: false
            };
            this.filtersSelected.match = {
                round: [],
                date: {
                    from: false,
                    to: false
                }
            };
            this.filtersSelected.tournament = {
                name: [],
                surface: [],
                env: []
            };
            this.filtersSelected.smartdata = {
                type: [],
                aggregation: []
            };
        }

        if (type === 'smartdata' || type === 'all') {
            this.filtersSelected.smartdata.type = [];
        }

        if (type === 'smartdata-filters' || type === 'all') {
            if (!Object.keys(this.filtersSelected.common).length) {
                this.filtersSelected.common = {};
            }
            this.filtersSelected.specific = {
                in: false,
                out: false,
                net: false,
                let: false
            };
            this.filtersSelected.score = {
                points: {
                    player_1: '',
                    player_1_tie: '',
                    player_2: '',
                    player_2_tie: ''
                },
                game: {
                    player_1: '',
                    player_2: ''
                },
                set: {
                    player_1: '',
                    player_2: ''
                }
            };
        }

        if (type === 'field-filters' || type === 'all') {
            this.filtersSelected.field = {
                ad: {},
                deuce: {}
            };
        }

        // INIZIALIZZO LA CRONOLOGIA DEI FILTRI
        this.simulationFiltersHistory = [];
        this.dataExchangeService.setSimulationFiltersHistoryData(this.simulationFiltersHistory);
    }

    initSelectedReportData() {
        this.reportSelected = [
            {
                id: 0,
                itemName: 'Nuovo Report',
                type: '',
                data: {
                    basic: {
                        notes: [],
                        rows: []
                    },
                    alert: {
                        notes: [],
                        rows: []
                    },
                    kpis: {
                        notes: [],
                        rows: []
                    },
                    ta: {
                        notes: [],
                        rows: []
                    },
                    custom: {
                        notes: [],
                        rows: []
                    }
                }
            }
        ];
    }

    // INIT VALIDATE

    initValidateFiltersSelectedData() {
        this.validateFiltersSelected = {
            player: {
                player_1: true,
                player_2: true,
            },
            match: {
                round: true,
                date: {
                    from: true,
                    to: true
                },
            },
            tournament: {
                name: true,
                surface: true,
                env: true
            },
            smartdata: {
                type: false,
                aggregation: {
                    match: true,
                    set: true,
                    game: true,
                    all: true
                }
            }
        };
    }

    // UPDATE SELECTED DATA

    updateSelectedFiltersData(type = 'all') {

        if (type === 'filters' || type === 'all') {

            // UPDATE PLAYER_1
            if (this.filters.player.player_1.length === 1 && !this.filtersSelected.player.player_1.length) {
                this.filtersSelected.player.player_1 = this.filters.player.player_1;
            }

            // UPDATE PLAYER_2
            if (this.filters.player.player_2.length === 1  && !this.filtersSelected.player.player_2.length) {
                this.filtersSelected.player.player_2 = this.filters.player.player_2;
            }

            // UPDATE AGAINST ALL
            if (this.filtersSelected.player.player_2.length === this.filters.player.player_2.length) {
                this.filtersSelected.player.against_all = true;
            }

            // UPDATE TOURNAMENT / NAME & ENV & SURFACE
            if (this.filters.tournament.name.length === 1 && !this.filtersSelected.tournament.name.length) {
                this.filtersSelected.tournament.name = this.filters.tournament.name;
            }
            if (this.filters.tournament.surface.length === 1 && !this.filtersSelected.tournament.surface.length) {
                this.filtersSelected.tournament.surface = this.filters.tournament.surface;
            }

            if (this.filters.tournament.env.length === 1) {
                this.filtersSelected.tournament.env = this.filters.tournament.env;
            }

            // UPDATE MATCH / ROUND & DATE
            if (this.filters.match.round.length === 1 && !this.filtersSelected.match.round.length) {
                this.filtersSelected.match.round = this.filters.match.round;
            }
            if (this.filters.match.date.length) {
                if (!this.filtersSelected.match.date.from) {
                    this.filtersSelected.match.date.from = {
                        isRange: false,
                        singleDate: {
                            date: {
                                year: this.filters.match.date[0].year,
                                month: this.filters.match.date[0].month,
                                day: this.filters.match.date[0].day
                            },
                            jsDate: moment(this.filters.match.date[0].id, 'YYYYMMDD').format(),
                            formatted: moment(this.filters.match.date[0].id, 'YYYYMMDD').format('YYYY/MM/DD'),
                            epoc: moment(this.filters.match.date[0].id, 'YYYYMMDD').unix()
                        },
                        dateRange: null
                    };
                }
                if (!this.filtersSelected.match.date.to) {
                    this.filtersSelected.match.date.to = {
                        isRange: false,
                        singleDate: {
                            date: {
                                year: this.filters.match.date[this.filters.match.date.length - 1].year,
                                month: this.filters.match.date[this.filters.match.date.length - 1].month,
                                day: this.filters.match.date[this.filters.match.date.length - 1].day
                            },
                            jsDate: moment(this.filters.match.date[this.filters.match.date.length - 1].id, 'YYYYMMDD').format(),
                            // tslint:disable-next-line:max-line-length
                            formatted: moment(this.filters.match.date[this.filters.match.date.length - 1].id, 'YYYYMMDD').format('YYYY/MM/DD'),
                            epoc: moment(this.filters.match.date[this.filters.match.date.length - 1].id, 'YYYYMMDD').unix()
                        },
                        dateRange: null
                    };
                }
            }
        }
    }

    // GET DATA

    getUser() {
        return this.authService.getCurrentUser();
    }

    getDatasets() {
        return this.datasetService.getDatasets();
    }

    getDataset(dataset) {
        return this.datasetService.getDataset(dataset);
    }

    // tslint:disable-next-line:max-line-length
    getMatches(match = [], report = (this.formData.isValid && this.reportSelected[0].type) ? [this.reportSelected[0].type] : [], filters = this.filtersSelected, override = 0) {
        if (!match.length) {
            this.datasetSelected.forEach((dataset) => {
                match.push(dataset.id);
            });
            // this.dataDatasetSelected = this.dataDatasetSelected.map(dataset => dataset.id);
        }

        return this.filtersService.getMatches(match, report, filters, override);
    }

    getSmartdataTypes() {
        return this.smartdataService.getSmartdataTypes();
    }

    getSmartdataFilters(type) {
        return this.smartdataService.getSmartdataFiltersCommon(type, (this.filtersSelected.smartdata.type.length) ? this.filtersSelected.smartdata.type[0].id : '');
    }

    getReports() {
        return this.reportService.getReports();
    }

    getReport(report) {
        return this.reportService.getReport(report);
    }

    // EVENT

    onDatasetSync(callback) {

        this.syncDatasets = true;

        // CANCELLO I DATI LOCALI
        this.filtersService.deleteFiltersLocal();
        this.datasetService.deleteDatasetsLocal();
        this.smartdataService.deleteSmartdataLocal();

        // DELAY TIME
        setTimeout(() => {

            console.log('DATASETS SYNC!');

            // RICARICO I DATASETS DAL DB
            this.getDatasets().subscribe((response: any) => {

                // AGGIORNO I DATASETS
                this.dataset = [...response.data.match];
                this.datasetSelected = [...response.data.match];

                const filtersCommon = this.filters.common;
                const filtersScore = this.filters.score;

                // ASSEGNO I FILTRI
                this.filters = {...response.data.filters};
                this.filters.common = filtersCommon;
                this.filters.score = filtersScore;

                // CONTROLLO SE CI SONO PLAYER SELEZIONATI
                if (this.filtersSelected.player.player_1.length) {
                    this.filters.player.player_1 = [...this.filtersSelected.player.player_1];
                }
                if (this.filtersSelected.player.player_2.length) {
                    this.filters.player.player_2 = [...this.filtersSelected.player.player_2];
                }

                this.syncDatasets = false;

                if (callback) {
                    callback(response);
                }
            });
        }, 1000);
    }

    onDatasetSelect(value, action) {

        if (action === 'deSelectAll') {
            // INIZIALIZZO I DATASETS SELEZIONATI
            this.initSelectedDatasetData();
        }

        this.onFormSubmit('', false);
    }

    onDatasetRemove() {
        this.datasetService.deleteDataset(this.datasetSelected).subscribe(
            (data) => {
                this.onFormReset(() => {
                    this.onDatasetSync(false);
                });
            },
            (err) => {
                console.error(err);
            }
        );
    }

    onDatasetAdd(value) {
        this.onDatasetSync(() => {
            console.log('DATASET IMPORTED!');
        });
    }

    onReportSync(callback) {

        this.syncReports = true;

        this.initReportData();

        setTimeout(() => {

            console.log('REPORTS SYNC!');

            // RICARICO I DATASETS DAL DB
            this.getReports().subscribe((response) => {

                // @ts-ignore AGGIORNO I DATASET E I DATASETS SELEZIONATI
                this.report = [...this.report, ...response.data];

                this.syncReports = false;

                if (callback) {
                    callback(response);
                }
            });
        }, 1000);
    }

    onReportSelect(value, action) {

        if (action === 'deSelectAll' || (action === 'deSelect' && !this.reportSelected.length)) {
            // INIZIALIZZO I REPORT SELEZIONATI
            this.initSelectedReportData();
        }

        if (this.reportSelected[0].id) {
            this.getReport([value.id]).subscribe((response) => {
                // @ts-ignore
                this.reportSelected = [...response.data];
                this.dataExchangeService.setSelectedReportData(this.reportSelected);
            });
        }
    }

    onReportRemove() {
        this.reportService.deleteReport(this.reportSelected).subscribe(
            (data) => {
                this.onReportSync((response) => {

                    // INIZIALIZZO REPORT
                    this.initReportData();

                    // INIZIALIZZO REPORT SELEZIONATI
                    this.initSelectedReportData();
                });
            },
            (err) => {
                console.error(err);
            }
        );
    }

    onReportAdd() {
        this.reportService.setReport(this.reportSelected).subscribe((response) => {
            // @ts-ignore
            if (response.status) {
                // @ts-ignore
                this.onReportSync(() => {
                    // @ts-ignore
                    this.onReportSelect(response.data, 'select');
                });
            }
        });
    }

    onReportExport() {
        const report = document.getElementById('report-body');
        // @ts-ignore
        html2canvas(report).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const doc = new jsPDF('p', 'mm', 'a4');
            let heightLeft = imgHeight;
            let position = -15;

            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save('report.pdf');
        });
    }

    onReportNoteAdd() {
        this.reportSelected[0].data[this.reportSelected[0].type].notes.push({
            title: '',
            description: '',
            color: '#FFED01',
            coords: {
                x: 0,
                y: 0
            },
            size: {
                width: 150,
                height: 150
            }
        });
    }

    onReportSectionAdd() {
        // modifica la variabile "this.dataBuilderSelected.add = true" nel report.component per aprire l'elenco delle sezioni
        this.addSection = true;
        setTimeout(() => {
            document.getElementById('reportBottom').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                this.addSection = false; // resetto
            }, 1000);
        }, 100);
    }

    onFiltersCheckboxChange(field, value, event) {

        if (field === 'smartdata-aggregation') {
            value = this.generalService.findIntoArrayofObject(value, this.smartdataService.getSmartdataAggregations(), 'id');
        }

        if (event.originalTarget.checked) {

            // tslint:disable-next-line:no-eval
            eval('this.dataFiltersSelected.' + field.replace(/-/g, '.') + '.push(value)');

        } else {

            // tslint:disable-next-line:no-eval max-line-length
            eval('this.dataFiltersSelected.' + field.replace(/-/g, '.') + ' = this.generalService.removeObjectFromArray(value.id, this.dataFiltersSelected.' + field.replace(/-/g, '.') + ', "id")');
        }

        // CONTROLLO SE CI SONO ANCORA GIOCATORI SELEZIONATI
        if (!this.filtersSelected.player.player_1.length || !this.filtersSelected.player.player_2.length) {

            // INIZIALIZZO I FILTRI SUL CAMPO
            this.initSelectedFiltersData('field-filters');

            // INIZIALIZZO I FILTRI SULLO SMARTDATA
            this.initSelectedFiltersData('smartdata-filters');
        }

        this.getMatches().subscribe((response: any) => {

            const filtersCommon = this.filters.common;
            const filtersScore = this.filters.score;

            // ASSEGNO I FILTRI
            this.filters = {...response.data.filters};
            this.filters.common = filtersCommon;
            this.filters.score = filtersScore;

            // ASSEGNO DI DEFAULT TUTTI I SERVE TYPE DISPONIBILI
            if (this.filtersSelected.common.hasOwnProperty('serve_type') && !this.filtersSelected.common.serve_type.values.length) {
                this.filtersSelected.common.serve_type.values = [...this.generalService.findIntoArrayofObject('serve_type', this.filters.common, 'id').values];
            }

            // CONVALIDO IL FORM
            this.validateForm();

            // ASSEGNO I RISULTATI DEI REPORT
            if (this.formData.isValid && response.data.report) {
                this.formData.results.report = {...response.data.report};
            }

            // ASSEGNO I RISULTATI DEI MATCH
            if (this.formData.isValid && response.data.match) {
                this.formData.results.match = [...response.data.match];
            }

            // @ts-ignore
            if (this.formData.isValid && response.data.smartdata) {

                // @ts-ignore SE IL FORM È VALIDO GENERO I RISULTATI
                this.formData.results.smartdata = {...response.data.smartdata};
                Object.keys(this.formData.results.smartdata).forEach((key) => {
                    this.formData.results.smartdata[key] = this.generalService.sortArrayOfObject(this.formData.results.smartdata[key], 'counts', -1);
                });

            } else {

                // INIZIALIZZO GLI SMARTDATA DISPONIBILI
                this.initFiltersData('smartdata');
            }

            this.formData.results.filters = this.filtersSelected;
            this.dataExchangeService.setResultsData(this.formData.results);
        });
    }

    onFiltersFieldChange(field, value) {

        if (field === 'player-against_all') {

            if (value) {

                // DESELEZIONO TUTTI GLI OPPONENTS PLAYER
                const filters = {};
                Object.keys(this.filtersSelected).forEach((key) => {
                    filters[key] = {...this.filtersSelected[key]};
                });
                // @ts-ignore
                filters.player.player_2 = [];

                this.getMatches([], [], filters, 0).subscribe((response: any) => {

                    // ASSEGNO I FILTRI
                    const filtersCommon = this.filters.common;
                    const filtersScore = this.filters.score;

                    // ASSEGNO I FILTRI
                    this.filters = {...response.data.filters};
                    this.filters.common = filtersCommon;
                    this.filters.score = filtersScore;

                    // ASSEGNO DI DEFAULT TUTTI I SERVE TYPE DISPONIBILI
                    if (this.filtersSelected.common.hasOwnProperty('serve_type') && !this.filtersSelected.common.serve_type.values.length && this.filters.common) {
                        this.filtersSelected.common.serve_type.values = [...this.generalService.findIntoArrayofObject('serve_type', this.filters.common, 'id').values];
                    }

                    // SELEZIONO TUTTI GLI OPPONENTS PLAYER DISPONIBILI
                    this.filtersSelected.player.player_2 = [...this.filters.player.player_2];

                    this.onFormSubmit('', false);
                });
            }

            // tslint:disable-next-line:max-line-length
        } else if ((field === 'match-date-from' && this.filtersSelected.match.date.to) || (field === 'match-date-to' && this.filtersSelected.match.date.from)) {

            if (field === 'match-date-from') {
                this.filtersSelected.match.date.from = value;
            } else if (field === 'match-date-to') {
                this.filtersSelected.match.date.to = value;
            }

            this.onFormSubmit('', false);
        }
    }

    onFiltersSelectChange(field, value, action = 'select') {

        // tslint:disable-next-line:variable-name
        const field_keys = field.split('-');

        if (action === 'deSelectAll') {

            // SVUOTO IL FILTRO SELEZIONATO
            // tslint:disable-next-line:no-eval
            eval('this.filtersSelected.' + field.replace(/-/g, '.') + ' = []');

            if (field_keys[0] === 'common') {
                this.onFiltersCommonChange(field_keys[1]);
            }
        }

        if (action === 'deSelectAll' || field === 'player-player_1') {
            this.onFormSubmit('', false);
        }

        if (field === 'player-player_1' || field === 'player-player_2') {
            // DISATTIVO IL FILTRO "AGAINST ALL"
            this.filtersSelected.player.against_all = false;
        }
    }

    onFiltersSelectClose(field) {

        // tslint:disable-next-line:variable-name
        const field_keys = field.split('-');

        // CONTROLLO SE CI SONO ANCORA GIOCATORI SELEZIONATI
        if (this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length) {

            // AGGIORNO LA CRONOLOGIA DEI COMMON FILTERS
            if (field_keys[0] === 'common') {
                this.onFiltersCommonChange(field_keys[1]);
            }
        }

        if (field === 'player-player_2' && !this.filtersSelected.player.player_2.length) {
            // DISATTIVO IL FILTRO "AGAINST ALL"
            this.filtersSelected.player.against_all = false;
        }

        this.onFormSubmit('', false);
    }

    onFiltersCommonChange(field) {

        // tslint:disable-next-line:variable-name
        const serve_type = this.generalService.findIntoArrayofObject('serve_type', this.filters.common, 'id');
        // tslint:disable-next-line:variable-name
        const serve_side = this.generalService.findIntoArrayofObject('serve_side', this.filters.common, 'id');
        // tslint:disable-next-line:variable-name
        const serve_outcome = this.generalService.findIntoArrayofObject('serve_outcome', this.filters.common, 'id');

        this.filtersSelected.common.serve_type.values = !this.filtersSelected.common.serve_type.values.length ? [serve_type.values[0]] : this.filtersSelected.common.serve_type.values;
        this.filtersSelected.common.serve_side.values = !this.filtersSelected.common.serve_side.values.length ? [serve_side.values[0]] : this.filtersSelected.common.serve_side.values;
        this.filtersSelected.common.serve_outcome.values = !this.filtersSelected.common.serve_outcome.values.length ? [serve_outcome.values[0]] : this.filtersSelected.common.serve_outcome.values;
    }

    onSmartdataTypeSelect(value) {

        // INIZIALIZZO I FILTRI SUL CAMPO
        this.initSelectedFiltersData('field-filters');

        // INIZIALIZZO I FILTRI SULLO SMARTDATA
        this.initFiltersData('smartdata-filters-common');
        this.initFiltersData('smartdata-filters-field');
        this.initSelectedFiltersData('smartdata-filters');

        if (value) {

            // SETTO LA TIPOLOGIA DI SMARTDATO TRA I FILTRI (DA MODIFICARE IN BASE A QUALI COMMON FILTERS APPARTENGONO A QUALI SMARTDATA)
            this.filtersSelected.smartdata.type = [this.generalService.findIntoArrayofObject(value.id, this.filters.smartdata.type, 'id')];

            const smartdataFiltersCommon = this.getSmartdataFilters('common');
            const smartdataFiltersField = this.getSmartdataFilters('field');

            smartdataFiltersCommon.forEach((common) => {
                this.filters.common.push(common);
                this.filtersSelected.common[common.id] = {
                    id: common.id,
                    itemName: common.itemName,
                    values: []
                };
            });

            smartdataFiltersField.forEach((field) => {
                this.filters.field.push(field);
                ['ad', 'deuce'].forEach((side) => {
                    this.filtersSelected.field[side][field.id] = {
                        id: field.id,
                        itemName: field.itemName,
                        values: []
                    };
                });
            });

            this.onFormSubmit('smartdata-type', () => {
                // const commons = this.smartdataService.getSmartdataFilters('common');
                /*this.filtersSelected.smartdata.type[0].filters.common.forEach((_common) => {
                    const common = this.generalService.findIntoArrayofObject(_common, commons, 'id');
                    this.filtersSelected.common[_common] = {
                        id: common.id,
                        itemName: common.itemName,
                        values: []
                    };
                    this.filters.common.push(common);
                });*/
                // delete this.filtersSelected.smartdata.type[0].filters;

                // INVIO I RISULTATI E IL REPORT SELEZIONATO
                this.dataExchangeService.setResultsData(this.formData.results);
                this.dataExchangeService.setSelectedReportData(this.reportSelected);
            });

        } else {

            this.formData.results.smartdata = false;

            this.initSelectedFiltersData('smartdata');

            this.initFiltersData('smartdata-filters-common');
            this.initFiltersData('smartdata-filters-field');

            this.dataExchangeService.setResultsData(this.formData.results);
        }
    }

    onReportTypeSelect(type) {

        this.reportSelected[0].type = type;

        this.onFormSubmit('report-type', false);
    }

    onAdvancedSelect(event) {
        /*this.dataFiltersSelected.player.player_2 = event;
        this.onFiltersSelectChange('player-player_2', event, 'select');*/
    }

    onFormReset(callback) {

        // INIZIALIZZO I RISULTATI DEL FORM
        this.initFormData();

        // INIZIALIZZO I FILTRI SELEZIONATI
        this.initSelectedFiltersData();

        // INIZIALIZZO LA VALIDAZIONE DEL FORM
        this.initValidateFiltersSelectedData();

        this.getMatches([], []).subscribe((response) => {

            // @ts-ignore ASSEGNO I FILTRI
            this.filters = {...response.data.filters};

            if (callback) {
                callback(response);
            }

            this.formData.results.filters = this.filtersSelected;
            this.dataExchangeService.setResultsData(this.formData.results);
        });
    }

    onFormSubmit(field = '', callback) {

        if (field !== 'smartdata-type' && field !== 'report-type') {
            // VALIDO IL FORM
            this.validateForm();
        }

        this.getMatches().subscribe((response: any) => {

            if (field !== 'smartdata-type' && field !== 'report-type') {

                const filtersCommon = this.filters.common;
                const filtersScore = this.filters.score;

                // ASSEGNO I FILTRI
                this.filters = {...response.data.filters};
                this.filters.common = filtersCommon;
                this.filters.score = filtersScore;

                // ASSEGNO DI DEFAULT TUTTI I SERVE TYPE DISPONIBILI
                if (this.filtersSelected.common.hasOwnProperty('serve_type') && !this.filtersSelected.common.serve_type.values.length && this.filters.common) {
                    this.filtersSelected.common.serve_type.values = [...this.generalService.findIntoArrayofObject('serve_type', this.filters.common, 'id').values];
                }

                // ELIMINO GIOCATORI DOPPI
                this.filters.player.player_1 = response.data.filters.player.player_1.filter((player) => {
                    return !this.generalService.findIntoArrayofObject(player.id, this.filtersSelected.player.player_2, 'id');
                });
                this.filters.player.player_2 = response.data.filters.player.player_2.filter((player) => {
                    return !this.generalService.findIntoArrayofObject(player.id, this.filtersSelected.player.player_1, 'id');
                });
            }

            if (field !== 'smartdata-type' && field !== 'report-type') {
                // CONVALIDO IL FORM
                this.validateForm();
            }

            if (this.formData.isValid) {
                // ASSEGNO I RISULTATI DEI REPORT
                this.formData.results.report = (response.data.report) ? {...response.data.report} : {};
                // ASSEGNO I RISULTATI DEI MATCH
                this.formData.results.match = (response.data.match) ? [...response.data.match] : [];
            }

            // @ts-ignore
            if (field !== 'report-type') {
                if (this.formData.isValid) {

                    // @ts-ignore SE IL FORM È VALIDO GENERO I RISULTATI
                    this.formData.results.smartdata = {...response.data.smartdata};
                    Object.keys(this.formData.results.smartdata).forEach((key) => {
                        this.formData.results.smartdata[key] = this.generalService.sortArrayOfObject(this.formData.results.smartdata[key], 'counts', -1);
                    });

                } else {
                    if (field !== 'smartdata-type') {
                        // INIZIALIZZO GLI SMARTDATA DISPONIBILI
                        this.initFiltersData('smartdata');
                    }
                }
            }

            if (callback) {
                callback();
            }

            if (field !== 'report-type') {
                this.dataExchangeService.setSelectedReportData(this.reportSelected);
            }

            if (field !== 'smartdata-type') {
                this.formData.results.filters = this.filtersSelected;
                this.dataExchangeService.setResultsData(this.formData.results);
            }
        });
    }

    onLogout() {

        // CANCELLO I FILE LOCALI
        this.filtersService.deleteFiltersLocal();
        this.datasetService.deleteDatasetsLocal();
        this.smartdataService.deleteSmartdataLocal();
        // TODO al momento commentata perchè i report vengono salvati in locale
        // this.reportService.deleteReportsLocal();

        // INIZIALIZZO I RISULTATI DEL FORM
        this.initFormData();

        // INIZIALIZZO I FILTRI SELEZIONATI
        this.initSelectedFiltersData();

        // INIZIALIZZO LA VALIDAZIONE DEL FORM
        this.initValidateFiltersSelectedData();

        // INIZIALIZZO I REPORT
        this.initSelectedReportData();

        this.dataExchangeService.setSelectedReportData(this.reportSelected);
        this.dataExchangeService.setResultsData(this.formData.results);

        this.authService.logout(() => {
            this.router.navigate(['/auth/login']);
        });
    }

    // VALIDATION

    validateForm() {

        this.formData.isValid = true;

        this.validateFiltersSelectedFields();

        for (const key in this.validateFiltersSelected) {
            // skip loop if the property is from prototype
            if (!this.validateFiltersSelected.hasOwnProperty(key)) { continue; }

            const obj = this.validateFiltersSelected[key];
            if (!obj) { this.formData.isValid = false; }
            for (const prop in obj) {
                // skip loop if the property is from prototype
                if (!obj.hasOwnProperty(prop)) { continue; }
                if (!obj[prop]) { this.formData.isValid = false; }
            }
        }
    }

    validateFiltersSelectedFields() {

        // VALIDATE PLAYERS / 1 & 2
        if (this.filtersSelected.player.player_1.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.player.player_1, this.filters.player.player_1, 'id');
            if (compared.length > 0) {
                this.filtersSelected.player.player_1 = [...compared];
                this.validateFiltersSelected.player.player_1 = true;
            } else {
                this.validateFiltersSelected.player.player_1 =  false;
            }
        } else {
            this.validateFiltersSelected.player.player_1 = false;
        }
        if (this.filtersSelected.player.player_2.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.player.player_2, this.filters.player.player_2, 'id');
            if (compared.length > 0) {
                this.filtersSelected.player.player_2 = [...compared];
                this.validateFiltersSelected.player.player_2 = true;
            } else {
                this.validateFiltersSelected.player.player_2 =  false;
            }
        } else {
            this.validateFiltersSelected.player.player_2 = false;
        }

        // VALIDATE TOURNAMENTS / TYPE & SURFACE & ENV
        if (this.filtersSelected.tournament.name.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.tournament.name, this.filters.tournament.name, 'id');
            if (compared.length > 0) {
                this.filtersSelected.tournament.name = [...compared];
                this.validateFiltersSelected.tournament.name = true;
            } else {
                this.validateFiltersSelected.tournament.name =  false;
            }
        } else {
            this.validateFiltersSelected.tournament.name = true;
        }
        if (this.filtersSelected.tournament.surface.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.tournament.surface, this.filters.tournament.surface, 'id');
            if (compared.length > 0) {
                this.filtersSelected.tournament.surface = [...compared];
                this.validateFiltersSelected.tournament.surface = true;
            } else {
                this.validateFiltersSelected.tournament.surface =  false;
            }
        } else {
            this.validateFiltersSelected.tournament.surface = true;
        }
        if (this.filtersSelected.tournament.env.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.tournament.env, this.filters.tournament.env, 'id');
            if (compared.length > 0) {
                this.filtersSelected.tournament.env = [...compared];
                this.validateFiltersSelected.tournament.env = true;
            } else {
                this.validateFiltersSelected.tournament.env =  false;
            }
        } else {
            this.validateFiltersSelected.tournament.env = true;
        }

        // VALIDATE MATCH / ROUND & DATE
        if (this.filtersSelected.match.round.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.match.round, this.filters.match.round, 'id');
            if (compared.length > 0) {
                this.filtersSelected.match.round = [...compared];
                this.validateFiltersSelected.match.round = true;
            } else {
                this.validateFiltersSelected.match.round = false;
            }
        } else {
            this.validateFiltersSelected.match.round = true;
        }

        // VALIDATE SMARTDATA / TYPE & AGGREGATION
        if (this.filtersSelected.player.player_1.length && this.filtersSelected.player.player_2.length) {
            this.validateFiltersSelected.smartdata.type = true;
        } else {
            this.validateFiltersSelected.smartdata.type = false;
        }
        // tslint:disable-next-line:max-line-length
        if (this.filtersSelected.smartdata.aggregation.length) {
            const compared = this.generalService.compareArrayofObject(this.filtersSelected.smartdata.aggregation, this.filters.smartdata.aggregation, 'id');
            if (compared.length > 0) {
                this.filtersSelected.smartdata.aggregation = [...compared];
                this.filtersSelected.smartdata.aggregation.forEach((aggregation) => {
                    this.validateFiltersSelected.smartdata.aggregation[aggregation.id.toLowerCase()] = true;
                });
            } else {
                this.filtersSelected.smartdata.aggregation.forEach((aggregation) => {
                    this.validateFiltersSelected.smartdata.aggregation[aggregation.id.toLowerCase()] = false;
                });
            }
        } else {
            this.validateFiltersSelected.smartdata.aggregation.set = true;
            this.validateFiltersSelected.smartdata.aggregation.match = true;
            this.validateFiltersSelected.smartdata.aggregation.game = true;
            this.validateFiltersSelected.smartdata.aggregation.all = true;
        }
    }

    // MODALS

    toggleModal(modal, status) {
        this.modals[modal] = status;
    }

    ngOnInit() {

        this.addSection = false;

        this.onDatasetSync(false);
        this.onReportSync(false);

        // collego il report
        this.dataExchangeService.reportSelected.subscribe((report) => {
            this.reportSelected = [...report];
        });

        // collego la history dei filtri sul campo
        this.dataExchangeService.simulationFiltersHistory.subscribe((history) => {
            this.simulationFiltersHistory = history;
        });

        // collego il flag per il fullscreen
        this.dataExchangeService.fullScreen.subscribe((val) => {
            this.fullScreen = val;
        });
    }

}
