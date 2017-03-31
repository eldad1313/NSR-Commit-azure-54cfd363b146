import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'mx-checkbox',
    templateUrl: './mx-checkbox.component.html',
    styleUrls: ['./mx-checkbox.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxCheckboxComponent,
        multi: true
    }]
})

export class MxCheckboxComponent implements OnInit, ControlValueAccessor {

    _onChange: Function;
    id: number;

    @Input() ngModel;

    constructor(private utilService: UtilService) { }

    ngOnInit() {
        this.id = this.utilService.random();
    }

    writeValue(val) {
        this.ngModel = val;
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() { }

    check() {
        this.ngModel = !this.ngModel;
        this._onChange && this._onChange(this.ngModel);
    }
}
