import { Component, OnInit, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomService } from '../../services/dom.service';
import * as _ from 'lodash';

@Component({
    selector: 'mx-drop-down',
    templateUrl: './mx-drop-down.component.html',
    styleUrls: ['./mx-drop-down.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: MxDropDownComponent,
        multi: true
    }]
})
export class MxDropDownComponent implements OnInit, ControlValueAccessor {

    _ngModel: any;
    _onChange: any;

    @Input() type;
    @Input() options;
    @Input() transcludeHeader;          // populates the drop-down header with the component's innerHtml
    @Input() placeholder;
    @Input() setOptionIndicators;
    @Input() prefix;
    @Input() disable;
    @Input() invalidStyle;
    @Input() ngModel;
    @Output() ngModelChange = new EventEmitter();

    constructor(
        private el: ElementRef,
        private domService: DomService) { }

    writeValue(val) {
        this.ngModel = val;
    }

    registerOnChange(fn) {
        this._onChange = fn;
    }

    registerOnTouched() { }

    ngOnInit() { }

    onHeaderClick() {
        // ng2-bootstrap stops event-propagation for clicks on this element.
        // This is our way of bypassing that, and still propagating clicks to document.body.
        this.domService.fire('bodyClick', this.el.nativeElement);
    }

    getSelectedVal() {
        let selectedObj = _.find(this.options, { id: this.ngModel });
        return selectedObj && selectedObj['val'];
    }

    select(option) {
        this.ngModel = option.id;
        this._onChange(this.ngModel);
    }
}
