import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobService } from '../../services/job.service';
import { RouteService } from '../../services/route.service';

@Component({
    templateUrl: './sys.module.html',
    styleUrls: ['./sys.module.scss']
})
export class SysModule implements OnInit, OnDestroy {

    constructor(
        private jobService: JobService,
        private routeService: RouteService) { }

    ngOnInit() {
        // this.jobService.init();
        this.routeService.startRecordingUrl();
    }

    ngOnDestroy() {
        this.routeService.stopRecordingUrl();
    }
}
