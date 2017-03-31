import { Injectable } from '@angular/core';
import { I18nPipe } from '../pipes/i18n.pipe';
import * as _ from 'lodash';
import * as moment from 'moment/moment';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../services/event.service';
import { DomService } from '../services/dom.service';

let i18n = new I18nPipe().transform;

@Injectable()
export class UtilService {

    popovers = {};

    constructor(
        private es: EventService,
        private domService: DomService) { }

    stringSorting(cfg: { data: any, property?: string, reverse?: boolean }) {
        let reverse = cfg.reverse || false;
        let noData = str => str === null || str === undefined;
        let fetchProperty = (obj, property) => _.at(obj, [property])[0];

        return cfg.data.sort((a, b) => {
            let nameA = (cfg.property ? fetchProperty(a, cfg.property) : a);
            let nameB = (cfg.property ? fetchProperty(b, cfg.property) : b);
            nameA = (noData(nameA) ? '' : nameA).toUpperCase();
            nameB = (noData(nameB) ? '' : nameB).toUpperCase();
            if (nameA < nameB) {
                return reverse ? 1 : -1;
            }
            if (nameA > nameB) {
                return reverse ? -1 : 1;
            }
            return 0;
        });
    }

    dateSorting(cfg: { data: any[], property?: string, newestFirst?: boolean }) {
        let newestFirst = cfg.newestFirst || false;
        return cfg.data.sort((a, b) => {
            let dateStrA = cfg.property ? _.at(a, cfg.property)[0] : a;
            let dateStrB = cfg.property ? _.at(b, cfg.property)[0] : b;

            // nulls are always sorted last
            if (dateStrA === null) {
                return dateStrB === null ? 0 : 1;
            } else if (dateStrB === null) {
                return -1;
            }

            return newestFirst ?
                Date.parse(dateStrB) - Date.parse(dateStrA) :
                Date.parse(dateStrA) - Date.parse(dateStrB);
        });
    }

    /**
     * Checks if 2 dates are of the same day
     */
    hasSameDate(date1: Date, date2: Date) {
        let date1Moment = moment(date1);
        let date2Moment = moment(date2);
        return <Boolean>(date1Moment.diff(date2Moment, 'days') === 0);
    }

    isObjEmpty(obj: any): boolean {
        return !obj || Object.keys(obj).length === 0;
    }

    convertEnumToStr(e: string): string {
        return i18n(`E.${e}`);
    }

    /**
     * Similar to Array.join(), it concatenates the object values to a string.
     */
    joinObjectValues(obj: any, spacer?: string): string {
        spacer = spacer || '';
        return Object.keys(obj).reduce((acc, key) => {
            return obj[key] ? `${acc}${spacer}${obj[key]}` : acc;
        }, '');
    }

    /**
     * Searches a subject string for a query string. Can be case-sensitive/insensitive
     */
    searchString(subject: string, query: string, caseInsensitive = true): boolean {
        if (caseInsensitive) {
            return subject ? subject.toUpperCase().includes(query.toUpperCase()) : false;
        } else {
            return subject ? subject.includes(query) : false;
        }
    }

    /**
     * Returns a random int with the specified number of digits.
     */
    random(digits = 4) {
        return Math.floor(Math.pow(digits, 10) * Math.random());
    }

    /** 
     * Compare between 2 dates by day.
     */
    dateCmp(date1, date2) {
        return {
            today: moment(date1).isSame(date2, 'day'),
            future: moment(date1).isBefore(date2, 'day'),
            past: moment(date1).isAfter(date2, 'day')
        }
    }

    isToday(date) {
        return moment().isSame(date, 'day');
    }

    popover(isOpen, hide) {
        if (!isOpen) {
            setTimeout(() => {
                this.domService.bodyClick$.take(1).subscribe(hide);
            }, 100);
        }
    }

    /**
     * Fires a 'next' if mouse is clicked on the DOM outside the specified class array or id array
     */
    onBlur(cls: string[], ids?: string[]) {
        cls = cls || [];
        ids = ids || [];

        let includesClass = elemClassList => {
            let res = false;
            cls.forEach(c => {
                if (elemClassList.includes(c)) res = true;
            });
            return res;
        }

        let includesId = elemId => {
            let res = false;
            ids.forEach(id => {
                if (elemId === id) res = true;
            });
            return res;
        }

        let isBlur = elem => {
            if (!elem || includesClass(Array.prototype.slice.call(elem.classList)) || includesId(elem.id)) {
                return false;
            }
            if (elem.tagName == 'BODY') return true;
            return isBlur(elem.parentNode);
        }

        return this.domService.bodyClick$.filter(event => isBlur(event['target']));
    }

    isDateWithinDates(dates: any[], date?: Date): Boolean {
        if (!date) date = new Date();
        for (let i = 0; i < dates.length; i++) {
            if (this.hasSameDate(new Date(+dates[i]), date)) {
                return true;
            }
        }
        return false;
    }

    downloadFile(path) {
        var aEle = document.createElement('a');
        aEle.setAttribute('href', path);
        document.body.appendChild(aEle);
        aEle.click();
        document.body.removeChild(aEle);
    }

    camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index !== 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
}
