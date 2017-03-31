/**
 * This component wraps all the app's modals. The modals will be injected into its 'modal-body' element.
 * It also has a configurable 'modal-header' and 'modal-footer' (which can be configured via the modalMap).
 * It has basic modal methods
 */
import { Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';
import { DialogComponent, DialogService } from '../../vendors/ng2-bootstrap-modal/index';
import * as _ from 'lodash';

interface ComponentData {
    component: any,  // class for the component you want to insert
    title?: string,  // the modal title
    btns: any[],     // an array of modal-buttons, that will be in the modal-footer
    args: any        // the args are received from the modalService.set({args: {}}) function caller)
}

@Component({
    selector: 'dynamic-component',
    template: `
        <div class="modal-content {{modalOptions && modalOptions.theme}}">
            <div class="modal-header" *ngIf="!!title">
                <icon type="Close" hover="true" pressed="true" (click)="close()" style="float:right;"></icon>
                <div class="modal-title">{{title}}</div>
            </div>
            <div class="modal-body">
                <div #modalContent></div>
            </div>
            <div class="modal-footer" *ngIf="!!btns">
                <div 
                    class="modal-btn-wrapper {{btn.wrapperClass && btn.wrapperClass.join(' ')}}"
                    *ngFor="let btn of btns">                    
                    <mx-button                         
                        class="{{btn.cssClass.join(' ')}}" 
                        [type]="btn.type"
                        [disable]="btnDisable(btn.id)"
                        (click)="!btnDisable(btn.id) && btnClicked(btn.id)">
                        <icon [type]="btn.icon" pointer="true" *ngIf="btn.icon"></icon>{{ btn.label }}
                    </mx-button>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./modal-wrapper.component.scss']
})
export class ModalWrapperComponent extends DialogComponent {
    currentComponent = null;
    title: string;
    btns: any[];
    btnFncsMap = {};
    disableBtnFncsMap = {};

    @ViewChild('modalContent', { read: ViewContainerRef }) modalContent: ViewContainerRef;

    // this will be injected into the modal-body
    @Input() set componentData(data: ComponentData) {
        if (!data) {
            return;
        }

        this.title = data.title;
        this.btns = data.btns;

        // all of these will be injected into the specific modal component and
        // will be available to it after calling super(injector) in its constructor.
        // args: contains the input args, from modalService.set({args: {} })
        let argsProviders = [
            {
                provide: 'registerBtn',
                useValue: this.registerBtn.bind(this)
            }, {
                provide: 'disableBtn',
                useValue: this.disableBtn.bind(this)
            }, {
                provide: 'modalConfirm',
                useValue: this.modalConfirm.bind(this)
            }, {
                provide: 'modalClose',
                useValue: this.close.bind(this)
            }, {
                provide: 'args',
                useValue: data.args || {}
            }, {
                provide: 'labelBtn',
                useValue: this.labelBtn.bind(this)
            }
        ];

        let resolvedArgs = ReflectiveInjector.resolve(argsProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedArgs, this.modalContent.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.modalContent.insert(component.hostView);

        // We can destroy the old component as we like by calling destroy
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        this.currentComponent = component;
    }

    constructor(dialogService: DialogService, private resolver: ComponentFactoryResolver) {
        super(dialogService);
    }

    /**
     * Closes the modal with a result. This value will be received by the
     * modalService.set().subscribe() after the modal closes.
     */
    modalConfirm(result) {
        this.result = result;
        this.close();
    }

    /**
     * Registers a function that will be called when the specific button
     * is pressed (by button-id).
     */
    registerBtn(btnId, fnc) {
        this.btnFncsMap[btnId] = fnc;
    }

    /**
     * Registers a function (that returns a boolean) that will decide whether
     * a specific button is disabled (by button-id).
     */
    disableBtn(btnId, fnc) {
        this.disableBtnFncsMap[btnId] = fnc;
    }

    /**
     * Will be executed whenever a button (in modal-footer) is pressed.
     * Checks if a function was registered to this button. If not, will
     * close the modal.
     */
    btnClicked(btnId) {
        if (this.btnFncsMap[btnId]) this.btnFncsMap[btnId]();
        else this.close();
    }

    /**
     * Will be executed whenever a button (in modal-footer) is pressed.
     * Checks if a disable-function was registered for this button.
     * If not, button will always be enabled.
     */
    btnDisable(btnId) {
        if (this.disableBtnFncsMap[btnId])
            return this.disableBtnFncsMap[btnId]();
        return false;
    }

    labelBtn(btnId, label) {
        _.find(this.btns, { id: btnId }).label = label;
    }
}
