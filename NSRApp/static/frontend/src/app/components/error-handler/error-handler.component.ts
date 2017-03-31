import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'error-handler',
    templateUrl: './error-handler.component.html',
    styleUrls: ['./error-handler.component.scss']
})
export class ErrorHandlerComponent implements OnInit, OnChanges {

    errDisplay: string;

    @Input() errors;
    @Input() data;
    @Input() showPristine;
    @Input() patternMsg;

    constructor() { }

    ngOnInit() {

    }

    ngOnChanges() {
        this.errDisplay = '';
        if (this.noErrors || this.isPristine && this.hideErrorsWhenPristine) {
            return;
        }
        for (let e in this.errors) {
            switch (e) {
                case 'required':
                    this.errDisplay += 'Required. ';
                    break;
                case 'minlength':
                    this.errDisplay += `Must be at least ${this.errors[e]['requiredLength']} characters. `;
                    break;
                case 'maxlength':
                    this.errDisplay += `Must be less than ${this.errors[e]['requiredLength'] + 1} characters. `;
                    break;
                case 'pattern':
                    this.errDisplay += this.patternMsg ? `${this.patternMsg} ` : `Pattern needed: ${this.errors[e]['requiredPattern']}. `;
            }
        }
    }

    private get noErrors() {
        return !this.errors;
    }

    private get isPristine() {
        return this.data.pristine;
    }

    private get hideErrorsWhenPristine() {
        return !this.showPristine;
    }
}
