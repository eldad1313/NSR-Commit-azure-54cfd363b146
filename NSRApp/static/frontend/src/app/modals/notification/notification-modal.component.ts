import { Component, Injector, OnInit } from '@angular/core';
import { ModalBaseComponent } from '../modal-base-component.component';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})

export class NotificationModalComponent extends ModalBaseComponent {

    constructor(public injector: Injector) {

        super(injector);

        this.registerBtn('ok', () => {
            this.modalConfirm('ok');
        });

    }
}



