import {Component, ViewChild, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

// ENV
import { environment } from '../../../../environments/environment';

// SERVICES
import { GeneralService } from '../../../services/general/general.service';
import { AuthService } from '../../../services/auth/auth.service';
import { DatasetService } from '../../../services/dataset/dataset.service';
import { FiltersService } from '../../../services/filters/filters.service';
import {findLast} from '@angular/compiler/src/directive_resolver';
import { Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-uploads-dataset',
    templateUrl: './uploads-dataset.component.html',
    styleUrls: ['./uploads-dataset.component.scss']
})
export class UploadsDatasetComponent implements OnInit, OnChanges {

    @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;

    @Input() toggle: boolean;
    @Input() datasetToEdit;
    @Output() toggleEmit = new EventEmitter<any>();
    @Output() datasetEmit = new EventEmitter<any>();

    dataset;
    datasetSelected;
    isEditing: boolean;

    formData;

    datepickerOptions = {
        dateRange: false,
        dateFormat: 'yyyy/mm/dd',
        todayTxt: 'TODAY',
        disableSince: {year: moment().format('YYYY'), month: moment().format('M'), day: moment().add(1, 'days').format('D')},
        disableHeaderButtons: false
    };

    multiselectOptions = {
        field_dataset_format: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            text: 'Select Format',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_player_1_name: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Insert or select Player',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_player_1_country: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            text: 'Insert or select Player Country',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_player_2_name: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Insert or select Player',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_player_2_country: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: false,
            badgeShowLimit: 1,
            text: 'Insert or select Player Country',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_tournament_name: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Insert or select Tournament',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_match_round: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Insert or select Round',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_tournament_surface: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Insert or select Surface',
            classes: 'select-advanced is-light is-addnew'
        },
        field_dataset_tournament_env: {
            singleSelection: true,
            enableSearchFilter: true,
            addNewItemOnFilter: true,
            badgeShowLimit: 1,
            text: 'Select Condition',
            classes: 'select-advanced is-light is-addnew'
        }
    };

    constructor(
        private http: HttpClient,
        private generalService: GeneralService,
        private authService: AuthService,
        private datasetService: DatasetService,
        private filtersService: FiltersService
    ) { }

    // INIT DATA

    initFormData() {
        this.formData = {
            isValid: false,
            isSubmit: false,
            message: {
                type: '',
                text: ''
            }
        };
    }

    initDatasetData() {
        this.dataset = {
            format: [],
            player: {
                player_1: [],
                player_2: [],
                all: [],
                country: []
            },
            tournament: {
                name: [],
                surface: [],
                env: []
            },
            match: {
                round: [],
                date: false,
            },
        };

        this.dataset.format = this.filtersService.getFormats();
        // tslint:disable-next-line:max-line-length
        this.dataset.player.player_1 = this.dataset.player.player_2 = this.dataset.player.all = this.filtersService.getPlayers();
        this.dataset.player.country = this.filtersService.getCountries();
        this.dataset.tournament.name = this.filtersService.getTournamentsName();
        this.dataset.tournament.surface = this.filtersService.getTournamentsSurface();
        this.dataset.tournament.env = this.filtersService.getTournamentsEnv();
        this.dataset.match.round = this.filtersService.getMatchesRound();
    }

    // INIT SELECTED DATA

    initDatasetSelectedData() {
        if(this.datasetToEdit){ // gli è stato passato un dataset, sono in modifica
            this.formatDatasetToEdit();
            this.isEditing = true;
        }else{ // non è stato passato un dataset, ne sto aggiungendo uno nuovo
            this.datasetSelected = {
                files: [],
                name: '',
                description: '',
                format: [],
                player: {
                    player_1: {
                        name: [],
                        country: []
                    },
                    player_2: {
                        name: [],
                        country: []
                    },
                },
                tournament: {
                    name: [],
                    surface: [],
                    env: []
                },
                match: {
                    round: [],
                    date: false
                },
            };
        }
    }

    // INIT EVENT

    onDatasetFileSelect(value) {
        this.onFileDropped(value);
    }

    onDatasetFieldsChange(field, value) {
        this.onFormValidate();
    }

    onDatasetSelectChange(field, value, action = 'select') {
        if (field === 'player-player_1-name') {
            this.dataset.player.player_2 = this.dataset.player.all.filter((player) => {
                return (Array.isArray(value) && !value.length) || player.id !== value.id;
            });
            if (value !== [] && value.hasOwnProperty('meta') && value.meta.country.id) {
                this.datasetSelected.player.player_1.country = [value.meta.country];
            }
        }
        if (field === 'player-player_2-name') {
            this.dataset.player.player_1 = this.dataset.player.all.filter((player) => {
                return (Array.isArray(value) && !value.length) || player.id !== value.id;
            });
            if (value !== [] && value.hasOwnProperty('meta') && value.meta.country.id) {
                this.datasetSelected.player.player_2.country = [value.meta.country];
            }
        }
        this.onFormValidate();
    }

    onDatasetSelectAdd(field, value, model) {
        // tslint:disable-next-line:variable-name
        const field_keys = field.split('-');
        // tslint:disable-next-line:variable-name
        const model_keys = model.split('-');

        let newItems = {};

        if (model_keys[0] === 'player') {
            // tslint:disable-next-line:variable-name
            const full_name = value.split(' ');
            newItems = {
                id: value,
                itemName: value,
                meta: {
                    first_name: (full_name.length > 1) ? value.replace(' ' + full_name[full_name.length - 1], '') : full_name[0],
                    last_name: (full_name.length > 1) ? full_name[full_name.length - 1] : '',
                    country: {
                        id: '',
                        itemName: ''
                    },
                    thumb: ''
                }
            };
            this.dataset[model_keys[0]][field_keys[1]].push(newItems);
            this.datasetSelected[field_keys[0]][field_keys[1]].name = [newItems];
            this.onDatasetSelectChange(field, newItems, 'select');
        } else if (model_keys[0] === 'tournament') {
            if (model_keys[1] === 'name') {
                newItems = {
                    id: value,
                    itemName: value
                };
            } else if (model_keys[1] === 'surface') {
                newItems = {
                    id: value.replace(/^\w/, (c) => c.toUpperCase()),
                    itemName: value.replace(/^\w/, (c) => c.toUpperCase())
                };
            } else if (model_keys[1] === 'env') {
                newItems = {
                    id: value.replace(/^\w/, (c) => c.toUpperCase()),
                    itemName: value.replace(/^\w/, (c) => c.toUpperCase())
                };
            }
            this.dataset[model_keys[0]][field_keys[1]].push(newItems);
            this.datasetSelected[field_keys[0]][field_keys[1]] = [newItems];
            this.onDatasetSelectChange(field, newItems, 'select');
        } else if (model_keys[0] === 'match') {
            if (model_keys[1] === 'round') {
                newItems = {
                    id: value.toUpperCase(),
                    itemName: value.toUpperCase()
                };
            }
            this.dataset[model_keys[0]][field_keys[1]].push(newItems);
            this.datasetSelected[field_keys[0]][field_keys[1]] = [newItems];
            this.onDatasetSelectChange(field, newItems, 'select');
        }
    }

    onFormValidate() {
        if (
            this.datasetSelected.files.length > 0 &&
            this.datasetSelected.name !== '' &&
            this.datasetSelected.format.length > 0 &&
            this.datasetSelected.player.player_1.name.length > 0 &&
            this.datasetSelected.player.player_1.country.length > 0 &&
            this.datasetSelected.player.player_2.name.length > 0 &&
            this.datasetSelected.player.player_2.country.length > 0 &&
            this.datasetSelected.tournament.name.length > 0 &&
            this.datasetSelected.tournament.surface.length > 0 &&
            this.datasetSelected.tournament.env.length > 0 &&
            this.datasetSelected.match.round.length > 0 &&
            this.datasetSelected.match.date !== false
        ) {
            this.formData.isValid = true;
        } else {
            this.formData.isValid = false;
        }
    }

    onFormSubmit() {
        if (this.formData.isValid) {
            this.formData.isSubmit = true;
            this.datasetService.importDataset(this.datasetSelected).subscribe(
                (response) => {
                    if (response.status) {
                        this.formData.isSubmit = false;
                        this.ngOnInit();
                        this.toggleModal();
                        // @ts-ignore
                        this.datasetEmit.emit(response.data);
                    } else {
                        this.formData.isSubmit = false;
                        this.onFormValidate();
                        this.formData.message.type = 'danger';
                        this.formData.message.text = response.message;
                    }
                },
                (err) => {
                    this.formData.isSubmit = false;
                    this.onFormValidate();
                    this.formData.message.type = 'danger';
                    this.formData.message.text = err.error.message;
                }
            );
        }
    }

    editDataset(){
        if (
          this.datasetSelected.name !== '' &&
          this.datasetSelected.format.length > 0 &&
          this.datasetSelected.player.player_1.name.length > 0 &&
          this.datasetSelected.player.player_1.country.length > 0 &&
          this.datasetSelected.player.player_2.name.length > 0 &&
          this.datasetSelected.player.player_2.country.length > 0 &&
          this.datasetSelected.tournament.name.length > 0 &&
          this.datasetSelected.tournament.surface.length > 0 &&
          this.datasetSelected.tournament.env.length > 0 &&
          this.datasetSelected.match.round.length > 0 &&
          this.datasetSelected.match.date !== false
        ) {
            this.datasetService.updateDataset(this.datasetSelected).subscribe(
                (response) => {
                    if (response.status) {
                        this.formData.isSubmit = false;
                        this.ngOnInit();
                        this.toggleModal();
                        // @ts-ignore
                        this.datasetEmit.emit(response.data);
                        localStorage.removeItem('dataset-' + this.datasetToEdit.id);
                    } else {
                        this.formData.isSubmit = false;
                        this.onFormValidate();
                        this.formData.message.type = 'danger';
                        this.formData.message.text = response.message;
                    }
                },
                (err) => {
                    this.formData.isSubmit = false;
                    this.onFormValidate();
                    this.formData.message.type = 'danger';
                    this.formData.message.text = err.error.message;
                }
            )
        }
    }

    // TOGGLE MODAL

    toggleModal() {
        if (!this.formData.isSubmit) {
            this.toggle = !this.toggle;
            this.toggleEmit.emit(this.toggle);
        }
    }

    // UPLOAD FILE

    /**
     * on file drop handler
     */

    onFileDropped($event) {
        if (this.datasetSelected.files.length === 0) {
            this.prepareFilesList($event);
        }
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        if (this.datasetSelected.files.length === 0) {
            this.prepareFilesList(files);
        }
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
        if (this.datasetSelected.files[index].progress < 100) {
            return;
        }
        this.datasetSelected.files.splice(index, 1);
        this.onFormValidate();
    }

    /**
     * Simulate the upload process
     */
    uploadFiles(index: number) {
        setTimeout(() => {
            if (index === this.datasetSelected.files.length) {
                this.onFormValidate();
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.datasetSelected.files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.uploadFiles(index + 1);
                    } else {
                        this.datasetSelected.files[index].progress += 5;
                    }
                }, 50);
            }
        }, 300);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            this.datasetSelected.files.push(item);
        }
        this.fileDropEl.nativeElement.value = '';
        this.uploadFiles(0);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formatDatasetToEdit(){
        this.datasetSelected = {
            files: [],
            name: this.datasetToEdit.itemName,
            description: this.datasetToEdit.description,
            format: [{id: "dartfish", itemName: "Dartfish"}],
            player: {
                player_1: {
                    name: [{
                        id: this.datasetToEdit.player.player_1.id,
                        itemName: this.datasetToEdit.player.player_1.itemName,
                        meta: this.datasetToEdit.player.player_1.meta
                    }],
                    country: [this.datasetToEdit.player.player_1.meta.country]
                },
                player_2: {
                    name: [{
                        id: this.datasetToEdit.player.player_2.id,
                        itemName: this.datasetToEdit.player.player_2.itemName,
                        meta: this.datasetToEdit.player.player_2.meta
                    }],
                    country: [this.datasetToEdit.player.player_2.meta.country]
                },
            },
            tournament: {
                name: [{
                    id: this.datasetToEdit.tournament.name.id,
                    itemName: this.datasetToEdit.tournament.name.itemName
                }],
                surface: [this.datasetToEdit.tournament.surface],
                env: [this.datasetToEdit.tournament.env]
            },
            match: {
                round: [{
                    id: this.datasetToEdit.match.round.id,
                    itemName: this.datasetToEdit.match.round.itemName
                }],
                date: {
                    singleDate:{
                        date:{
                            day: this.datasetToEdit.match.date.day,
                            month: this.datasetToEdit.match.date.month,
                            year: this.datasetToEdit.match.date.year
                        },
                        formatted: this.datasetToEdit.match.date.year + "/" + this.datasetToEdit.match.date.month + "/" + this.datasetToEdit.match.date.day
                    }
                },
                id: this.datasetToEdit.id,
            },
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('toggle') && changes.toggle.currentValue) {
            this.ngOnInit();
        }
    }

    ngOnInit() {
        this.initFormData();
        this.initDatasetData();
        this.initDatasetSelectedData();
    }
}
