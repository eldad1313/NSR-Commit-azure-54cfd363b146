/**
 * This is the global busy-indicator (BI). It observes the process-counter from BusyIndicatorService.
 * When the counter is positive, it shows itself. Otherwise, it is hidden.
 */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BusyIndicatorService } from '../../services/busy-indicator.service';

@Component({
    selector: 'busy-indicator',
    templateUrl: './busy-indicator.component.html',
    styleUrls: ['./busy-indicator.component.scss']
})
export class BusyIndicatorComponent implements OnInit {
    showBusyIndicator = false;

    constructor(
        private bi: BusyIndicatorService,
        private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.bi.observe().subscribe(processes => {
            this.showBusyIndicator = processes > 0;
            this.changeDetectorRef.detectChanges(); // this is needed to avoid errors when opening a modal that makes API calls
        });
    }
}
