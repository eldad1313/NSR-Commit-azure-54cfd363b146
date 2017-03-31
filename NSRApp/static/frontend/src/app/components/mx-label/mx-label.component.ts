import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'mx-label',
    templateUrl: './mx-label.component.html',
    styleUrls: ['./mx-label.component.scss']
})
export class MxLabelComponent implements OnInit {

    @Input() type;

    constructor() { }

    ngOnInit() {

    }

}
