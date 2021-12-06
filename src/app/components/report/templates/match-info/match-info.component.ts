import {Component, EventEmitter, Injectable, Input, OnInit, Output, SimpleChanges} from '@angular/core';

import * as moment from 'moment';

// SERVICES
import { GeneralService } from '../../../../services/general/general.service';
import { FiltersService } from '../../../../services/filters/filters.service';
import { DataExchangeService } from '../../../../services/data-exchange/data-exchange.service';

@Component({
    selector: 'app-match-info',
    templateUrl: './match-info.component.html',
    styleUrls: ['./match-info.component.scss']
})
@Injectable({
    providedIn: 'root'
})
export class MatchInfoComponent implements OnInit {

    @Input() resultsData;
    @Input() reportName;
    @Input() reportId;
    @Input() reportSelected;
    @Input() filtersSelected;
    @Output() exportComponentEmit = new EventEmitter();

    constructor(
        public generalService: GeneralService,
        private filtersService: FiltersService,
        private dataExchangeService: DataExchangeService
    ) { }

    // GET DATA
    getMatches(filters = this.filtersSelected) {
        return this.filtersService.getMatches(this.resultsData.match.map(value => value.id), ['custom'], filters, 0);
    }

    initComponentData() {

        this.reportSelected.component = {
            player: {
                player_1: [...this.filtersSelected.player.player_1],
                player_2: [...this.filtersSelected.player.player_2]
            },
            results: []
        };

        if (this.resultsData.match && this.resultsData.match.length) {
            let sets = true;
            this.resultsData.match.forEach((match) => {
                // tslint:disable-next-line:variable-name
                if (!match.match.set.length) {
                    sets = false;
                }
            });

            if (!sets) {
                this.getMatches().subscribe((response) => {
                    this.reportSelected.component.results = this.resultsData.match = response.data.match;
                });
            } else {
                this.reportSelected.component.results = this.resultsData.match;
            }
        }
    }

    ngOnInit() {
        if ((this.reportName !== 'custom' && !this.reportId) || !Object.keys(this.reportSelected.component).length) {
            this.initComponentData();
            this.exportComponent();
        }
    }

    exportComponent() {
        this.exportComponentEmit.emit(this.reportSelected.component);
    }

}
