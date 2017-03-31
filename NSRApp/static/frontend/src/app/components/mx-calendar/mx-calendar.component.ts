import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'mx-calendar',
    templateUrl: './mx-calendar.component.html',
    styleUrls: ['./mx-calendar.component.scss']
})
export class MxCalendarComponent implements OnInit, OnChanges {

    constructor(private utilService: UtilService) { }

    dayIndex: any;
    weeks: any[];
    year: number;
    month: number;
    today: Date;
    days: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    @Input() date;
    @Input() type;
    @Input() indications;
    @Input() enableSelect;
    @Input() enablePastSelection;
    @Input() disableFutureSelection;
    @Input() selected;
    @Output() selectedChange = new EventEmitter<Date>();

    ngOnChanges(c) {
        if (this.indications) {
            this.integrateIndications();
        }
    }

    ngOnInit() {
        if (this.selected) this.date = _.cloneDeep(this.selected);
        if (!this.date) this.date = new Date();

        this.today = new Date();
        this.setCalendarMetadata();
        this.setWeeks();
    }

    setCalendarMetadata() {
        this.year = this.date.getFullYear();
        this.month = this.date.getMonth();
    }

    setWeeks() {
        let getNextWeek = () => {
            let newWeek = [];
            this.weeks.push(newWeek);
            return newWeek;
        }

        this.weeks = [];
        this.dayIndex = {};

        let firstDayOnWeekOfTheMonth = new Date(this.year, this.month, 1).getDay();
        let lastDayOfTheMonth = new Date(this.year, this.month + 1, 0).getDate();

        let currentWeek = getNextWeek();
        let dayIdx = --firstDayOnWeekOfTheMonth;
        if (dayIdx < 0) dayIdx = 6;
        for (let day = 1; day <= lastDayOfTheMonth; day++ , dayIdx++) {
            if (currentWeek.length == 7) {
                currentWeek = getNextWeek();
                dayIdx = 0;
            }
            currentWeek[dayIdx] = {
                dayNum: day,
                today: (this.today.getFullYear() == this.year) && (this.today.getMonth() == this.month) && (this.today.getDate() == day),
                future: (() => {
                    if (this.today.getFullYear() !== this.year) {
                        return this.today.getFullYear() < this.year;
                    } else if (this.today.getMonth() !== this.month) {
                        return this.today.getMonth() < this.month;
                    } else {
                        return this.today.getDate() < day;
                    }
                })(),
                get past() {
                    return !this.future && !this.today;
                }
            }
            this.dayIndex[day] = currentWeek[dayIdx];
        }
    }

    changeMonth(val) {
        this.month += val;
        if (this.month < 0) {
            this.month = 11;
            this.year--;
        } else if (this.month == 12) {
            this.month = 0;
            this.year++;
        }
        this.date.setMonth(this.month);
        this.date.setYear(this.year);
        this.setWeeks();
        this.integrateIndications();
    }

    integrateIndications() {

        // reset indications
        for (let day in this.dayIndex) {
            this.dayIndex[day].indication = null;
        };

        for (let date in this.indications) {
            let dateObj = new Date(date);
            let day = dateObj.getDate();
            if ((dateObj.getFullYear() == this.year) && (dateObj.getMonth() == this.month)) {
                this.dayIndex[day].indication = {
                    type: this.indications[date].indication,
                    showAgregator: this.indications[date].sum > 1,
                    agregatorSum: this.indications[date].sum,
                    popover: this.indications[date].popover
                }
            }
        }
    }

    select(day) {
        this.selected = new Date(Date.UTC(this.year, this.month, day.dayNum));
        this.selectedChange.emit(this.selected);
    }

    isSelected(day) {
        return this.selected && (this.selected.getFullYear() == this.year) && (this.selected.getMonth() == this.month) && (this.selected.getDate() == day.dayNum);
    }

}
