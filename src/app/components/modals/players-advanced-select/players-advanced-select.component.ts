import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';

// SERVICES
import { GeneralService } from '../../../services/general/general.service';
import { FiltersService } from '../../../services/filters/filters.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-players-advanced-select',
    templateUrl: './players-advanced-select.component.html',
    styleUrls: ['./players-advanced-select.component.scss']
})
export class PlayersAdvancedSelectComponent implements OnInit, OnChanges {

    @Input() toggle: boolean;
    @Output() toggleEmit = new EventEmitter<any>();

    @Input() dataset;
    @Input() players;
    @Input() playersSelected;
    @Output() playersSelectedEmit = new EventEmitter<any>();

    dataPlayersList;

    datatableOptions = {
        columnMode: { flex: 'flex' },
        selectionType: { multiClick: 'multiClick' },
        selected: []
    };

    constructor(
        private generalService: GeneralService,
        private filtersService: FiltersService
    ) { }

    // INIT DATA

    initDatasetData() {
        this.dataset = [];
    }

    initPlayersData() {
        this.players = {
            player_1: [],
            player_2: [],
            name: []
        };
    }

    initPlayersListData() {
        this.dataPlayersList = {
            rows: [],
            columns: [
                {name: 'Name', prop: 'itemName', flexGrow: 3},
                {name: 'Rank', prop: 'rank', flexGrow: 1},
                {name: 'Vs', flexGrow: 1}
            ]
        };
    }

    // INIT SELECTED
    initSelectedPlayersData() {
        this.playersSelected = {
            player_1: [],
            player_2: [],
            against_all: false
        };
    }

    // UPDATE DATA

    updatePlayersList(callback) {
        this.dataPlayersList.rows = [];
        this.dataset.forEach((dataset, i) => {
            if (!this.playersSelected.player_1.length || dataset.data.players.player_1[0].id !== this.playersSelected.player_1[0].id) {
                if (!dataset.data.players.player_2.length || this.generalService.findIntoArrayofObject(dataset.data.players.player_2[0].id, this.players.player_2, 'id')) {
                    dataset.data.players.player_2[0].enable = true;
                }
            } else {
                dataset.data.players.player_2[0].enable = false;
            }
            this.dataPlayersList.rows.push(dataset.data.players.player_2[0]);
        });
        this.dataPlayersList.rows = this.generalService.mergeObjectsInUnique(this.dataPlayersList.rows, 'id');
        callback();
    }

    // EVENTS

    onRowSelect({ selected }) {

    }

    checkRowSelectable(event) {
        return event.enable;
    }

    getRowClass(row) {
        return {
            'is-active': row.enable
        };
    }

    onFormReset() {
        this.playersSelected.player_2 = [];
        this.playersSelected.against_all = false;
    }

    onFormSubmit() {
        this.toggleModal();
        this.playersSelectedEmit.emit(this.playersSelected.player_2);
    }

    // TOGGLE MODAL

    toggleModal() {
        this.toggle = !this.toggle;
        this.toggleEmit.emit(this.toggle);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('dataset')) {
            this.dataset = [...changes.dataset.currentValue];
        }
        if (changes.hasOwnProperty('dataPlayers')) {
            this.players = Object.assign({}, changes.players.currentValue);
        }
        if (changes.hasOwnProperty('dataPlayersSelected')) {
            this.playersSelected = Object.assign({}, changes.playersSelected.currentValue);
        }
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.initPlayersListData();
        if (!this.dataset) {
            this.initDatasetData();
        }
        if (!this.players) {
            this.initPlayersData();
        }
        if (!this.playersSelected) {
            this.initSelectedPlayersData();
        }
        this.updatePlayersList(() => {
            if (this.playersSelected.player_2.length) {
                const selectedPlayers = this.playersSelected.player_2;
                this.playersSelected.player_2 = [];
                this.dataPlayersList.rows.forEach((player, i) => {
                    if (player.enable && this.generalService.findIntoArrayofObject(player.id, selectedPlayers, 'id')) {
                        this.playersSelected.player_2.push(player);
                    }
                });
            }
        });
    }

}
