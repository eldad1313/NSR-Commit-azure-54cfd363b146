import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DataEventService } from '../../services/data-event.service';
import { EventService } from '../../services/event.service';
import * as _ from 'lodash';

@Component({
    selector: 'main-menu',
    templateUrl: './main.menu.html',
    styleUrls: ['./main.menu.scss']
})
export class MainMenu implements OnInit {

    mainMenuBtns: any[];

    constructor(
        private router: Router,
        private dataEventService: DataEventService,
        private es: EventService) { }

    ngOnInit() {
        this.mainMenuBtns = [
            // { id: '', label: 'menu.testimonials', url: '/sys/pools' },
            // { id: '', label: 'menu.faq', url: '/sys/assignments' },
            // { id: '', label: 'menu.contactAs', url: '/sys/reports' },
            // { id: '', label: 'menu.about', url: '/sys/settings' }
        ];

        this.es.observe('NAVIGATION_END').subscribe(routeEvent => {
            this.switchActiveButton(routeEvent);
        });
    }

    route(btn) {
        if (!btn.active) {
            this.router.navigate([btn.url]);
        }
    }

    switchActiveButton(routerEvent) {
        
    }
}
