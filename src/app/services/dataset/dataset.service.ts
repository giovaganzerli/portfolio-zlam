import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as moment from 'moment';

// ENV
import { environment } from '../../../environments/environment';

// SERVICES
import { AuthService } from '../auth/auth.service';
import { GeneralService } from '../general/general.service';
import { FiltersService } from '../filters/filters.service';
import { SmartdataService } from '../smartdata/smartdata.service';

@Injectable({
    providedIn: 'root'
})
export class DatasetService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private generalService: GeneralService,
        private filterService: FiltersService,
        private smartdataService: SmartdataService
    ) { }

    importDataset(dataset) {

        const localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [];

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    format: '',
                    player: {
                        player_1: {
                            first_name: '',
                            last_name: '',
                            country: ''
                        },
                        player_2: {
                            first_name: '',
                            last_name: '',
                            country: ''
                        }
                    },
                    match: {
                        name: '',
                        description: '',
                        round: '',
                        date: '',
                        id: ''
                    },
                    tournament: {
                        name: '',
                        surface: '',
                        env: '',
                    }
                },
                csv: []
            },
            body: new FormData(),
            response: {
                status: false,
                message: '',
                data: []
            }
        };

        request.params.metadata = {
            user_id: request.user.id,
            format: dataset.format[0].id,
            player: {
                player_1: {
                    first_name: dataset.player.player_1.name[0].meta.first_name,
                    last_name: dataset.player.player_1.name[0].meta.last_name,
                    country: dataset.player.player_1.country[0].id
                },
                player_2: {
                    first_name: dataset.player.player_2.name[0].meta.first_name,
                    last_name: dataset.player.player_2.name[0].meta.last_name,
                    country: dataset.player.player_2.country[0].id
                }
            },
            match: {
                name: dataset.name,
                description: dataset.description,
                round: dataset.match.round[0].id,
                date: moment(dataset.match.date.singleDate.formatted, 'YYYY/MM/DD').format('YYYY-MM-DD'),
                id: ''
            },
            tournament: {
                name: dataset.tournament.name[0].itemName,
                surface: dataset.tournament.surface[0].id,
                env: dataset.tournament.env[0].id
            }
        };

        request.params.csv = [...dataset.files];

        Object.keys(request.params).forEach((key) => {
            if (key === 'csv') {
                request.body.append(key, request.params[key][0], request.params[key][0].name);
            } else {
                request.body.append(key, JSON.stringify(request.params[key]));
            }
        });

        return this.http.post(environment.apiUrl + '/importer/import', request.body)
            .pipe(
                map((response: any) => {

                    if (response && response.match) {

                        request.response.status = true;
                        request.response.message = '';

                        request.response.data = {
                            // @ts-ignore
                            id: response.match.id,
                            itemName: response.match.name,
                            description: response.match.description,
                            format: dataset.format
                        };

                        localDatasets.push(request.response.data);
                        localStorage.setItem('datasets', JSON.stringify(localDatasets));

                    } else {
                        request.response.status = false;
                        // tslint:disable-next-line:max-line-length
                        request.response.message = (response.hasOwnProperty('message')) ? response.message : 'Unknown error occurred. Retry!';
                    }
                    return request.response;
                })
            );
    }

    updateDataset(dataset) {
        const oldId = dataset.match.id;

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    format: '',
                    player: {
                        player_1: {
                            first_name: '',
                            last_name: '',
                            country: ''
                        },
                        player_2: {
                            first_name: '',
                            last_name: '',
                            country: ''
                        }
                    },
                    match: {
                        name: '',
                        description: '',
                        round: '',
                        date: '',
                        id: ''
                    },
                    tournament: {
                        name: '',
                        surface: '',
                        env: '',
                    }
                },
                csv: []
            },
            body: new FormData(),
            response: {
                status: false,
                message: '',
                data: []
            }
        };

        request.params.metadata = {
            user_id: request.user.id,
            format: dataset.format[0].id,
            player: {
                player_1: {
                    first_name: dataset.player.player_1.name[0].meta.first_name,
                    last_name: dataset.player.player_1.name[0].meta.last_name,
                    country: dataset.player.player_1.country[0].id
                },
                player_2: {
                    first_name: dataset.player.player_2.name[0].meta.first_name,
                    last_name: dataset.player.player_2.name[0].meta.last_name,
                    country: dataset.player.player_2.country[0].id
                }
            },
            match: {
                name: dataset.name,
                description: dataset.description,
                round: dataset.match.round[0].id,
                date: moment(dataset.match.date.singleDate.formatted, 'YYYY/MM/DD').format('YYYY-MM-DD'),
                id: dataset.match.id
            },
            tournament: {
                name: dataset.tournament.name[0].itemName,
                surface: dataset.tournament.surface[0].id,
                env: dataset.tournament.env[0].id
            }
        };

        Object.keys(request.params).forEach((key) => {
            request.body.append(key, JSON.stringify(request.params[key]));
        });

        return this.http.post(environment.apiUrl + '/importer/update', request.body)
            .pipe(
                map((response: any) => {
                    if (response && response.match) {

                        request.response.status = true;
                        request.response.message = '';

                        request.response.data = {
                            // @ts-ignore
                            id: response.match.id,
                            itemName: response.match.name,
                            description: response.match.description,
                            format: dataset.format
                        };

                        let localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [];
                        localDatasets = localDatasets.filter((dataset) => {
                            return dataset.id !== oldId;
                        });
                        localStorage.setItem('datasets', JSON.stringify(localDatasets));

                    } else {
                        request.response.status = false;
                        // tslint:disable-next-line:max-line-length
                        request.response.message = (response.hasOwnProperty('message')) ? response.message : 'Unknown error occurred. Retry!';
                    }
                    return request.response;
                })
            );
    }

    deleteDataset(dataset) {

        let localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [];

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    match_id: 0
                }
            },
            body: new FormData(),
            response: {
                status: false,
                message: '',
                data: []
            }
        };

        request.params.metadata = {
            user_id: request.user.id,
            // @ts-ignore
            match_id: dataset[0].id + ''
        };

        Object.keys(request.params).forEach((key) => {
            console.log(key);
            console.log(JSON.stringify(request.params[key]));
            request.body.append(key, JSON.stringify(request.params[key]));
        });

        console.log(request);
        console.log(request.body);

        return this.http.post(environment.apiUrl + '/importer/delete', request.body)
            .pipe(
                map((response: any) => {
                    if (response && response.message === 'data deleted') {

                        request.response.status = true;
                        request.response.message = '';

                        // @ts-ignore
                        request.response.data = request.params.metadata.match_id;

                        localDatasets = localDatasets.filter((dataset) => {
                            return dataset.id !== request.params.metadata.match_id;
                        });

                        localStorage.setItem('datasets', JSON.stringify(localDatasets));
                        localStorage.removeItem('dataset-' + request.params.metadata.match_id);

                    } else {
                        request.response.status = false;
                        request.response.message = 'Error';
                    }
                    return request.response;
                })
            );
    }

    deleteDatasetsLocal() {

        const localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [];

        localDatasets.forEach((dataset) => {
            localStorage.removeItem('dataset-' + dataset.id);
        });

        localStorage.removeItem('datasets');
    }

    getDatasets() {

        const localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [];

        if (localDatasets.length) {
            localDatasets.forEach((dataset, i) => {
                if (!localStorage.getItem('dataset-' + dataset.id)) {
                    localDatasets.splice(i, 1);
                    localStorage.setItem('datasets', JSON.stringify(localDatasets));
                } else {
                    localDatasets[i].data = JSON.parse(localStorage.getItem('dataset-' + dataset.id)).data;
                }
            });
            return new Observable((observer: any) => {
                observer.next({
                    status: true,
                    message: '',
                    data: localDatasets
                });
            });
        }

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    player: {
                        ref_player: {
                            id: []
                        },
                        opp_player: {
                            id: []
                        }
                    },
                    match: {
                        override_filters: 0,
                        id: [],
                        round: [],
                        date: {
                            from: '',
                            to: ''
                        },
                    },
                    tournament: {
                        id: [],
                        surface: [],
                        env: []
                    },
                    smartdata: {
                        type: [],
                        aggregation: [],
                        override_columns: []
                    },
                    report: {
                        type: [],
                        aggregation: []
                    }
            }
            },
            body: new FormData(),
            response: {
                status: false,
                message: '',
                data: []
            }
        };

        request.params.metadata.user_id = request.user.id;

        Object.keys(request.params).forEach((key) => {
            request.body.append(key, JSON.stringify(request.params[key]));
        });

        return this.http.post(environment.apiUrl + '/analytics', request.body)
            .pipe(
                map((response: any) => {
                    if (response && response.hasOwnProperty('filters')) {

                        request.response.status = true;
                        request.response.message = '';

                        if (response.filters.player.ref_player.length) {
                            this.filterService.setPlayers(response.filters.player.ref_player);
                        }
                        if (response.filters.player.opp_player.length) {
                            this.filterService.setPlayers(response.filters.player.opp_player);
                        }
                        if (response.filters.tournament.length) {
                            this.filterService.setTournamentsName(response.filters.tournament);
                        }
                        this.filterService.setTournamentsSurface(response.filters.surface);
                        this.filterService.setTournamentsEnv(response.filters.env);
                        this.filterService.setMatchesRound(response.filters.round);
                        /*if (response.filters.date.from || response.filters.date.to) {
                            this.filterService.setMatchesDate([response.filters.date.from, response.filters.date.to]);
                        }*/
                        if (response.filters.smartdata.type.length) {
                            this.smartdataService.setSmartdataTypes();
                        }

                        request.response.data = {
                            // @ts-ignore
                            match: [],
                            filters: this.filterService.getMatchFilters(response.filters),
                            smartdata: (response.smartdata) ? response.smartdata : false,
                        };

                        // @ts-ignore
                        response.filters.match.forEach((match, i) => {

                            this.filterService.setMatchesDate([match.meta.date]);

                            // @ts-ignore AGGIORNO I MATCH
                            request.response.data.match.push(this.getDatasetData(match));

                            // AGGIORNO I DATASETS LOCALI
                            localDatasets.push({
                                id: match.id,
                                itemName: match.itemName,
                                description: match.description,
                            });

                            // @ts-ignore AGGIORNO IL DATASET LOCALE
                            localStorage.setItem('dataset-' + match.id, JSON.stringify(request.response.data.match[i]));
                        });

                        localStorage.setItem('datasets', JSON.stringify(localDatasets));

                    } else {
                        request.response.status = false;
                        // tslint:disable-next-line:max-line-length
                        request.response.message = (response.hasOwnProperty('message')) ? response.message : 'Unknown error occurred. Retry!';
                    }
                    return request.response;
                })
            );
    }

    getDataset(id) {

        // tslint:disable-next-line:one-variable-per-declaration
        let localDatasets = (localStorage.getItem('datasets')) ? JSON.parse(localStorage.getItem('datasets')) : [],
            localDataset = true;

        if (localDatasets.length) {
            // tslint:disable-next-line:variable-name
            id.forEach((_id) => {
                if (!localStorage.getItem('dataset-' + _id)) {
                    localDataset = false;
                }
            });

            if (localDataset) {
                localDatasets = [];
                // tslint:disable-next-line:variable-name
                id.forEach((_id) => {
                    localDatasets.push(JSON.parse(localStorage.getItem('dataset-' + _id)));
                });
                return new Observable((observer: any) => {
                    observer.next({
                        status: true,
                        message: '',
                        data: localDatasets
                    });
                });
            }
        }

        const request = {
            user: this.authService.getCurrentUser(),
            params: {
                metadata: {
                    user_id: 0,
                    player: {
                        ref_player: {
                            id: []
                        },
                        opp_player: {
                            id: []
                        }
                    },
                    match: {
                        override_filters: 0,
                        id: [],
                        round: [],
                        date: {
                            from: '',
                            to: ''
                        },
                    },
                    tournament: {
                        id: [],
                        surface: [],
                        env: []
                    },
                    smartdata: {
                        type: [],
                        aggregation: []
                    },
                    report: {
                        type: [],
                        aggregation: []
                    }
                }
            },
            body: new FormData(),
            response: {
                status: false,
                message: '',
                data: []
            }
        };

        request.params.metadata.user_id = request.user.id;
        request.params.metadata.match.id = id;
        request.params.metadata.match.override_filters = 1;

        Object.keys(request.params).forEach((key) => {
            request.body.append(key, JSON.stringify(request.params[key]));
        });

        return this.http.post(environment.apiUrl + '/analytics', request.body)
            .pipe(
                map((response: any) => {
                    if (response && response.hasOwnProperty('filters')) {

                        request.response.status = true;
                        request.response.message = '';

                        if (response.filters.player.ref_player.length) {
                            this.filterService.setPlayers(response.filters.player.ref_player);
                        }
                        if (response.filters.player.opp_player.length) {
                            this.filterService.setPlayers(response.filters.player.opp_player);
                        }
                        if (response.filters.tournament.length) {
                            this.filterService.setTournamentsName(response.filters.tournament);
                        }
                        if (response.filters.surface.length) {
                            this.filterService.setTournamentsSurface(response.filters.surface);
                        }
                        if (response.filters.env.length) {
                            this.filterService.setTournamentsEnv(response.filters.env);
                        }
                        if (response.filters.round.length) {
                            this.filterService.setMatchesRound(response.filters.round);
                        }
                        /*if (response.filters.date.from || response.filters.date.to) {
                            this.filterService.setMatchesDate([response.filters.date.from, response.filters.date.to]);
                        }*/
                        if (response.filters.smartdata.type.length) {
                            this.smartdataService.setSmartdataTypes();
                        }

                        request.response.data = {
                            // @ts-ignore
                            match: [],
                            filters: this.filterService.getMatchFilters(response.filters),
                            smartdata: (response.smartdata) ? response.smartdata : false
                        };

                        // @ts-ignore
                        response.filters.match.forEach((match, i) => {

                            this.filterService.setMatchesDate([match.meta.date]);

                            // @ts-ignore
                            const cover = (response.report.hasOwnProperty('cover')) ? this.generalService.findIntoArrayofObject(match.id, response.report.cover, 'match_id') : false;

                            // @ts-ignore AGGIORNO I MATCH
                            request.response.data.match.push(this.getDatasetData(match, cover));

                            // AGGIORNO I DATASETS LOCALI
                            localDatasets.push({
                                id: match.id,
                                itemName: match.itemName,
                                description: match.description,
                            });

                            // @ts-ignore AGGIORNO IL DATASET LOCALE
                            localStorage.setItem('dataset-' + match.id, JSON.stringify(request.response.data.match[i]));
                        });

                        localStorage.setItem('datasets', JSON.stringify(localDatasets));
                    } else {
                        request.response.status = false;
                        // tslint:disable-next-line:max-line-length
                        request.response.message = (response.hasOwnProperty('message')) ? response.message : 'Unknown error occurred. Retry!';
                    }
                    return request.response;
                })
            );
    }

    getDatasetData(dataMatchSelected) {

        const dataMatch = {
            id: dataMatchSelected.id,
            itemName: dataMatchSelected.itemName,
            description: dataMatchSelected.description,
            player: {
                player_1: {},
                player_2: {}
            },
            match: {
                round: {},
                set: [],
                date: {},
                winner: ''
            },
            tournament: {
                name: {},
                surface: {},
                env: {}
            }
        };

        dataMatch.player.player_1 = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.player_1_id, this.filterService.getPlayers(), 'id');
        dataMatch.player.player_2 = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.player_2_id, this.filterService.getPlayers(), 'id');
        dataMatch.tournament.surface = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.surface, this.filterService.getTournamentsSurface(), 'itemName');
        dataMatch.tournament.env = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.env, this.filterService.getTournamentsEnv(), 'itemName');
        dataMatch.tournament.name = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.tournament_id, this.filterService.getTournamentsName(), 'id');
        dataMatch.match.round = this.generalService.findIntoArrayofObject(dataMatchSelected.meta.round, this.filterService.getMatchesRound(), 'itemName');
        dataMatch.match.date = this.generalService.findIntoArrayofObject(moment(dataMatchSelected.meta.date, 'YYYY-MM-DD').format('YYYYMMDD'), this.filterService.getMatchesDate(), 'id');

        return dataMatch;
    }
}
