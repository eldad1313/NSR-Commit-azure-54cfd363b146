/**
 * This service handles the app's global busy-indicator (BI). It works via a counter.
 * When the counter is 0, the BI is off. When it is greater than 0, the BI is on.
 * You can increase or decrease the counter and thus control the BI visibility.
 * The visibility is controlled via busy-indicator.component, which observes the counter.
 */
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BusyIndicatorService {
    private counter = 0;
    private processes$: Subject<number>;

    constructor() {
        this.processes$ = new Subject();
    }

    observe() {
        return this.processes$;
    }

    increase() {
        this.counter++;
        this.processes$.next(this.counter);
    }

    decrease() {
        this.counter--;
        if (this.counter < 0) {
            console.error('minus value of counter [busy indicator service]');
            this.counter = 0;
        }
        this.processes$.next(this.counter);
    }
}
