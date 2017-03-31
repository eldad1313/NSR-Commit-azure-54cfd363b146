import { Component, OnInit } from '@angular/core';
import { DataEventService } from '../../services/data-event.service';

@Component({
    selector: 'job-indicator',
    templateUrl: './job-indicator.component.html',
    styleUrls: ['./job-indicator.component.scss']
})
export class JobIndicatorComponent implements OnInit {

    title: string;

    constructor(private dataEventService: DataEventService) { }

    ngOnInit() {
        this.dataEventService.observe('JOB_TITLE').subscribe(title => this.title = title);
    }

}
