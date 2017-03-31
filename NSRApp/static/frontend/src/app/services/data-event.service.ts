/**
 * This service is responsible for relaying data across the app. Data is relayed using keys that
 * are saved in the 'subjects' object. Each key contains a ReplaySubject, that can emit values
 * to its observers on command. ReplaySubject remembers its last emitted value so on the moment
 * of subscription, the observer automatically receives the last emitted value.
 * You can observe any specific key and get updated whenever it emits a new value.
 * Additionally, the 'snapshots' object saves the snapshot of the last emitted value of each key. This
 * value can be retrieved synchronously via the snapshot method.
 */
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class DataEventService {
    private subjects = {};
    private snapshots = {};

    constructor() { }

    /**
     * returns a reference to the subject that can be subscribed to by calling .subscribe()
     */
    observe(subjectKey: string): ReplaySubject<any> {
        return this.getSubject(subjectKey);
    }

    /**
     * tells the Rx.ReplaySubject to publish a 'next' event (containing val) to its subscribers/observers
     */
    emit(subjectKey: string, val: any): void {
        this.snapshots[subjectKey] = val;
        this.getSubject(subjectKey).next(val);
    }

    /**
     * returns a snapshot of the Subject
     */
    snapshot(subjectKey: string): any {
        return this.snapshots[subjectKey] !== undefined ? this.snapshots[subjectKey] : null;
    }

    /**
     * unsubscribes all the subject's observers and releases system-resources
     */
    dispose(subjectKey: string): void {
        if (this.subjects[subjectKey]) {
            this.subjects[subjectKey].complete();
            delete this.subjects[subjectKey];
        }
        if (this.snapshots[subjectKey]) {
            delete this.snapshots[subjectKey];
        }
    }

    /**
     * retrieves a list of all active subject-keys
     */
    activeSubjectKeys(): any {
        return Object.keys(this.subjects);
    }

    /**
     * Creates a new Rx.ReplaySubject that can emit Observable events to subscribed observers.
     * Upon subscription, the observer immediately receives the last emitted event.
     */
    private getSubject(subjectKey: string): ReplaySubject<any> {
        if (!this.subjects[subjectKey]) {
            this.subjects[subjectKey] = new ReplaySubject(1);
        }
        return this.subjects[subjectKey];
    }
}
