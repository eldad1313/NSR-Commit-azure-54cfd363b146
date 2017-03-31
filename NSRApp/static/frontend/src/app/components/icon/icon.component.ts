import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
    inputs: ['type', 'hover', 'pressed', 'pointer']
})
export class IconComponent implements OnInit {

    private type: string;
    private hover: boolean = false;     // giving hover=true will change icon color when hovering over it (if available)
    private pressed: boolean = false;   // giving pressed=true will change icon color when pressing it (if available)
    private pointer: boolean = false;   // giving pointer=true will only ensure cursor:pointer but will not change icon color

    constructor() { }

    ngOnInit() {
    }


}
