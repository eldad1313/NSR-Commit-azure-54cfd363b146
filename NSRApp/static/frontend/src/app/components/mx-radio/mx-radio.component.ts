import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'mx-radio',
    templateUrl: './mx-radio.component.html',
    styleUrls: ['./mx-radio.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxRadioComponent,
        multi: true
    }]
})
export class MxRadioComponent implements OnInit {

    id: number;
    _onChange: Function;
    _ngModel: any;

    @Input() name;
    @Input() value;
    @Input() set ngModel(val){
        this._ngModel = val;
    };

    get ngModel(){
        return this._ngModel;
    }

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

    change(){
        this._onChange && this._onChange(this.value);
    }

}
