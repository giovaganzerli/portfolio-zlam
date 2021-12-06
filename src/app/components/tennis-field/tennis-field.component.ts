import { Component, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataExchangeService } from "../../services/data-exchange/data-exchange.service";

@Component({
    selector: 'app-tennis-field',
    templateUrl: './tennis-field.component.html',
    styleUrls: ['./tennis-field.component.scss']
})
export class TennisFieldComponent implements OnInit {

    // INIT SELECTED
    selectedTab;
    fullScreen: boolean;

    @Input() formData: any;
    @Input() filtersSelected: any;
    @Input() datasetSelected: any;
    @Input() resultsData: any;

    constructor(
      private dataExchangeService: DataExchangeService
    ) { }

    initTabSelectedData() {
        this.selectedTab = 'data-view';
    }

    ngOnInit(): void {
        this.initTabSelectedData();
        // Bool per il full screen
        this.dataExchangeService.fullScreen.subscribe(val => {
            this.fullScreen = val;
        });
    }

    goFullScreen(val) {
        this.fullScreen = val;
        this.dataExchangeService.setFullScreen(this.fullScreen);
    }
}
