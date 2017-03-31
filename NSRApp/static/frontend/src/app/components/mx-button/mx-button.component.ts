import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'mx-button',
    templateUrl: './mx-button.component.html',
    styleUrls: ['./mx-button.component.scss']
})
export class MxButtonComponent implements OnInit {

    constructor() { }

    @Input() type;
    @Input() disable;

    ngOnInit() {
        
    }

}
