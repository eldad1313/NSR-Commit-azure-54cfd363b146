import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilService } from '../../services/util.service';
import { EventService } from '../../services/event.service';
import * as moment from 'moment/moment';

@Component({
    selector: 'mx-datepicker',
    templateUrl: './mx-datepicker.component.html',
    styleUrls: ['./mx-datepicker.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxDatepickerComponent,
        multi: true
    }]
})
export class MxDatepickerComponent implements OnInit {

    instanceId: number = this.utilService.random(10);
    private _onChange: Function;
    private _selected: Date;
    private isPopupOpen = false;

    @Input() enableArrows;
    @Input() selected;
    @Input() format;
    @Input() layout;    // add a class to the .popover that is opened (see _bootstrap-modifications.scss)
    @Input() placeholder;
    @Input() type;
    @Input() enablePastSelection;
    @Input() disableFutureSelection;
    @Input() disable;
    @Output() selectedChange = new EventEmitter<Date>();
    @ViewChild('pop') pop;

    constructor(
        private utilService: UtilService,
        private es: EventService) { }

    ngOnInit() { }

    writeValue(val) {
        this.selected = val;
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() { }

    onSelectedChanged() {
        this.selectedChange.emit(this.selected);
        this._onChange && this._onChange(this.selected);
    }

    changeDay(val) {
        this.selected = moment(this.selected).add(val, 'days')['_d'];
        this.onSelectedChanged();
    }

    togglePopup() {
        this.pop.toggle();
        this.isPopupOpen = !this.isPopupOpen;
        if (this.isPopupOpen) {
            this.closePopupOnBlur();
        }
    }

    private closePopupOnBlur() {
        this.utilService.onBlur(null, [this.instanceId.toString()]).take(1).subscribe(() => {
            this.pop.hide();
            this.isPopupOpen = false;
        });
    }
}
