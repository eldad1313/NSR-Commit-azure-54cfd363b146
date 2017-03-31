import { Component, OnInit } from '@angular/core';
import { ModalService } from './services/modal.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    // AppComponent must initialize modalService so its constructor emits
    // its instance to dataService and dataService becomes functional.
    constructor(private modalService: ModalService) { }

    ngOnInit() { }
}
