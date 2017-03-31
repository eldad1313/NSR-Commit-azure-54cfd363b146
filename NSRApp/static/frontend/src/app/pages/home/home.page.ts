import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {

    sections: any[];

    constructor() { }

    ngOnInit() {
        this.sections = [
            {
                icon: 'home-icon-1',
                titleKey: 'home.section1.title',
                bodyKey: 'home.section1.body'
            },
            {
                icon: 'home-icon-2',
                titleKey: 'home.section2.title',
                bodyKey: 'home.section2.body'
            },
            {
                icon: 'home-icon-3',
                titleKey: 'home.section3.title',
                bodyKey: 'home.section3.body'
            },
            {
                icon: 'home-icon-4',
                titleKey: 'home.section4.title',
                bodyKey: 'home.section4.body'
            },
        ];
    }

}
