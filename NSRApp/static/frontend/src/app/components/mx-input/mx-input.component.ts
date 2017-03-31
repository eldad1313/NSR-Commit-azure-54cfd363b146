import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'mx-input',
    templateUrl: './mx-input.component.html',
    styleUrls: ['./mx-input.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxInputComponent,
        multi: true
    }]
})
export class MxInputComponent implements OnInit {

    _ngModel: any;
    _onChange: Function;

    @Input() disable;
    @Input() placeholder;
    @Input() theme;
    @Input() type;

    @Input() set ngModel(val) {
        this._ngModel = val;
        this._onChange && this._onChange(val);
    }

    get ngModel() {
        return this._ngModel;
    }

    constructor() { }

    ngOnInit() {

    }

    writeValue(val) {
        this.ngModel = val;
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() { }

}
