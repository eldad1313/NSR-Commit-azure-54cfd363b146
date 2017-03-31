import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { UtilService } from './util.service';
import { ModalService } from './modal.service';
import { DataEventService } from './data-event.service';
import { I18nPipe } from '../pipes/i18n.pipe';
import * as _ from 'lodash';
let i18n = new I18nPipe().transform;

@Injectable()
export class JobService {

    jobs$;

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private dataEventService: DataEventService,
        private utilService: UtilService) { }

    init() {
        this.normal();
    }

    set(time) {
        this.clear();
        this.jobs$ = Observable.interval(time).subscribe(this.getJobs.bind(this));
    }

    clear(){
        this.jobs$ && this.jobs$.complete();
    }

    faster() {
        this.set(500);
    }

    normal() {
        this.set(10000);
    }

    getJobs() {
        this.dataService.api({
            type: 'getJobs',
            disableBI: true
        }).subscribe(this.analyzeJobs.bind(this), this.clear.bind(this));
    }

    analyzeJobs(jobs) {
        let jobCount = 0;

        if (!jobs || !jobs.length || jobs.length == 0) {
            this.normal();            
        } else {
            jobs.forEach(j => {
                switch (j.status) {
                    case 'DONE':
                        this.handleDone(j);
                    break;
                    case 'FAILED':
                        this.handleFailed(j);
                    break;
                    case 'IN_PROGRESS':
                        jobCount++;
                    break;
                }
            });
        }

        this.dataEventService.emit('JOB_TITLE', jobCount > 0 ? _.template(i18n('jobs.exportingMsg'))({jobCount: jobCount}) : null);
    }

    handleDone(job) {
        switch (job.type) {
            case 'REPORT':
                // download file
                this.utilService.downloadFile(`/api/download/?file=${job.result.url}`);
                break;
        }
        this.delete(job);
    }

    handleFailed(job) {
        switch (job.type) {
            case 'REPORT':
                // error handle
                this.modalService.alert({bodyKey: 'jobs.failed'})
                break;
        }
        this.delete(job);
    }

    delete(job) {
        this.dataService.api({
            type: 'deleteJob',
            disableBI: true,
            urlParams: {
                jobId: job.jobId
            }
        }).subscribe(res => console.info('job has been deleted successfully'));
    }

}
