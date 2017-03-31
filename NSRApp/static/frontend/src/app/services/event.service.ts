/**
 * This service relays events through the app. Events are key-strings that are saved
 * In the 'subjects' object. Their value is a Subject that can emit events when required
 * to all of its observers.
 * The service also defines some built-in events in its constructor.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class EventService {
    private subjects = {};

    constructor(private router: Router) {

        // 'NAVIGATION_END': router navigation-end event
        this.router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.emit('NAVIGATION_END', val);
            }
        });

        // 'TAB_VISIBILITY_CHANGED': an observable of <Boolean> if the app-tab is the visible tab in the browser
        // 'TAB_VISIBLE': an observable that fires when the app-tab becomes visible
        // 'TAB_INVISIBLE': an observable that fires when the app-tab becomes invisible
        document.addEventListener('visibilitychange', e => {
            this.emit('TAB_VISIBILITY_CHANGED', document.visibilityState === 'visible');
            document.visibilityState === 'visible' ? this.emit('TAB_VISIBLE') : this.emit('TAB_INVISIBLE');
        });

        // this puts the emit function on the global window object.
        // It allows any entity to emit an event. Even if it isn't in Angular.
        window['emit'] = this.emit.bind(this);
    }

    observe(key: string): Subject<any> {
        if (!this.subjects[key]) {
            this.subjects[key] = new Subject();
        }
        return this.subjects[key];
    }

    emit(key: string, val?: any): void {
        this.observe(key).next(val || null);
    }

    dispose(key: string): void {
        if (this.subjects[key]) {
            this.subjects[key].complete();
            delete this.subjects[key];
        }
    }

    get activeEvents(): any[] {
        return Object.keys(this.subjects);
    }
}
