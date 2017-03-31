import { Component, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'mx-textarea',
    templateUrl: './mx-textarea.component.html',
    styleUrls: ['./mx-textarea.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxTextareaComponent,
        multi: true
    }]
})
export class MxTextareaComponent implements OnInit {

    _onChange: Function;
    _ngModel: any;

    @Input() placeholder;
    @Input() maxLength;
    @Input() set ngModel(val) {
        this._ngModel = val;
        this._onChange && this._onChange(this.ngModel);
    };

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
