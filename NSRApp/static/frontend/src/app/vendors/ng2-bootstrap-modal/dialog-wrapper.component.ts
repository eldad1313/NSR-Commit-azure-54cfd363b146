import {
    Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, ReflectiveInjector, Type
} from '@angular/core';
import { DialogComponent } from "./dialog.component";

@Component({
    selector: 'dialog-wrapper',
    template: `
        <div 
            class="modal modal-default-theme fade" 
            [ngClass]="{'in':shown}" 
            style="display:block !important;" 
            role="dialog"
            (click)="backdrop($event)">
            <div class="modal-dialog" [style.width.px]="cfg.width">
            <template #element></template>
            </div>
        </div>
  `
})
export class DialogWrapperComponent {

    cfg: any;

    backdrop(event){
        if (this.cfg.backdrop && event.target.classList.value.indexOf('modal-default-theme') != -1){
            this.content.close();
        }
    }

    /**
     * Target element to insert dialog content component
     * @type {ViewContainerRef}
     */
    @ViewChild('element', { read: ViewContainerRef }) private element: ViewContainerRef;

    /**
     *
     * @type {boolean}
     */
    private shown: boolean = false;

    /**
     * Dialog content componet
     * @type {DialogComponent}
     */
    private content: DialogComponent;

    /**
     * Constructor
     * @param {ComponentFactoryResolver} resolver
     */
    constructor(private resolver: ComponentFactoryResolver) { }

    /**
     * Adds content dialog component to wrapper
     * @param {Type<DialogComponent>} component
     * @return {DialogComponent}
     */
    addComponent(component: Type<DialogComponent>) {
        let factory = this.resolver.resolveComponentFactory(component);
        let injector = ReflectiveInjector.fromResolvedProviders([], this.element.injector);
        let componentRef = factory.create(injector);
        this.element.insert(componentRef.hostView);
        this.content = <DialogComponent>componentRef.instance;
        this.content.wrapper = this;
        return this.content;
    }

    // cfg: {width}
    setModalCfg(cfg) {
        let defaults = {
            width: 300
        }
        this.cfg = Object.assign({}, defaults, cfg);
    }

    /**
     * Shows dialog
     */
    show(): void {
        this.shown = true;
    }

    /**
     * Hides dialog
     */
    hide(): void {
        this.shown = false;
    }
}


