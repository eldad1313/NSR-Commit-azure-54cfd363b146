import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';
import { ModalService } from '../../services/modal.service';
import { DataService } from '../../services/data.service';
import { I18nPipe } from '../../pipes/i18n.pipe';

let i18n = new I18nPipe().transform;

@Component({
    selector: 'main-menu-profile',
    templateUrl: './main-menu-profile.component.html',
    styleUrls: ['./main-menu-profile.component.scss']
})
export class MainMenuProfileComponent implements OnInit {
    DROP_DOWN_OPTIONS = [{ id: 'logout', val: i18n('login.signOut') }];
    dropDownModel;
    userDetails: any = {};
    date: Date;

    constructor(
        private authService: AuthService,
        private jobService: JobService,
        private modalService: ModalService,
        private router: Router,
        private dataService: DataService) { }

    ngOnInit() {
        
    }

    openLogoutPopup() {
        this.modalService.bool({
            bodyKey: 'modals.signOut'
        }).subscribe(res => {
            if (res === 'ok') {
                this.submitLogout();
            }
        });
    }

    private submitLogout() {
        this.authService.setLoggedOut().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }
}
