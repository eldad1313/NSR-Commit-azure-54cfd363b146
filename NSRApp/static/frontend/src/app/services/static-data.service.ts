import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';

@Injectable()
export class StaticDataService {
    private Pool: any;

    constructor(private dataService: DataService) { }

    // currently only support for type='Pool'
    get(type: 'Pool'): Observable<any> {
        if (!this[type]) {
            return this.dataService.api({
                type: `get${type}Static`
            }).do((res) => this[type] = res);
        } else {
            return Observable.of(this[type]);
        }
    }
}
