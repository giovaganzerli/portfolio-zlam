import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-round-percentage',
    templateUrl: './round-percentage.component.html',
    styleUrls: ['./round-percentage.component.scss']
})
export class RoundPercentageComponent implements OnInit {

    @Input() title;
    @Input() subtitle;
    @Input() color;
    @Input() current;
    @Input() max;

    constructor() { }

    ngOnInit(): void {
    }

}
