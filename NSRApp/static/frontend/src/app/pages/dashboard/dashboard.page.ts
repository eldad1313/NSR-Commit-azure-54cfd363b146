import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

    constructor(private modalService: ModalService) { }

    ngOnInit() {
    }

    modal() {
        this.modalService.alert({            
            body: 'Hello Maytronics, this is the body of the Alert notification !'
        });
    }

}
