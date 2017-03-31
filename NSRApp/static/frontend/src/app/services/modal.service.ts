/**
 * This service handles opening modals. It depends on the 3rd party -
 * ng2-bootstrap-modal. Its main function is 'set', which looks in modalMap
 * for the modal settings and opens the modal based on that and the input cfg arg.
 */
import { Injectable } from '@angular/core';
import { DialogService } from '../vendors/ng2-bootstrap-modal/index';
import { ModalCfg } from '../interfaces/modalCfg.interface';
import { ModalWrapperComponent } from '../modals/sample/modal-wrapper.component';
import { modalMap } from '../maps/modal.map';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { I18nPipe } from '../pipes/i18n.pipe';
import { DataEventService } from './data-event.service';

let i18n = new I18nPipe().transform;

@Injectable()
export class ModalService {

    constructor(
        private dialogService: DialogService,
        private dataEventService: DataEventService
    ) {
        // ModalService emits its intance here so DataService can use it instead
        // of injecting it in the normal manner. This is done to avoid a circular DI
        // issue (dataService -> modalService -> modalMap -> <various components> -> dataService)
        this.dataEventService.emit('MODAL_SERVICE', this);
    }

    /**
     * Opens a modal whose properties are defined by the modalMap. The specific
     * modal will be injected into the ModalWrapperComponent and will inherit all
     * its methods by calling super(injector) in its constructor.
     */
    set(modalCfg: ModalCfg): Observable<any> {
        let specificModal = _.cloneDeep(modalMap[modalCfg.type]);

        if (!specificModal.options) specificModal.options = {};
        if (!specificModal.args) specificModal.args = {};

        for (let key in modalCfg.options) {
            specificModal.options[key] = modalCfg.options[key];
        }

        for (let key in modalCfg.args) {
            specificModal.args[key] = modalCfg.args[key];
        }

        if (modalCfg.btns) specificModal.btns = modalCfg.btns;

        specificModal.title = modalCfg.title || specificModal.title;

        return this.dialogService.addDialog(ModalWrapperComponent, specificModal.options || {}, {
            componentData: specificModal,
        });
    }

    /**
     * Opens an alert (notification) popup with an 'ok' button
     */
    alert(cfg: { body?: string, bodyKey?: string }): Observable<any> {
        let body;
        if (cfg.bodyKey) {
            body = i18n(cfg.bodyKey);
        } else if (cfg.body) {
            body = cfg.body;
        }

        return this.set({
            type: 'notification',
            options: {
                theme: 'notification warning'
            },
            args: {
                iconType: 'Alert',
                body: body
            }
        });
    }

    /**
     * Opens a notification popup with 'ok' and 'cancel' buttons
     */
    bool(cfg: { body?: string, bodyKey?: string, html?: string, yesKey?: string, noKey?: string }): Observable<any> {
        let body;
        if (cfg.bodyKey) {
            body = i18n(cfg.bodyKey);
        } else if (cfg.body) {
            body = cfg.body;
        }

        return this.set({
            type: 'notification',
            options: {
                theme: 'notification warning'
            },
            args: {
                iconType: 'Alert',
                body: body,
                html: cfg.html
            },
            btns: [
                { id: 'ok', type: 'medium-grey', label: i18n(cfg.yesKey || 'modals.yes'), cssClass: ['text-center'], wrapperClass: ['margin-bottom-6'] },
                { id: 'cancel', type: 'medium-clear-grey', label: i18n(cfg.noKey || 'modals.no'), cssClass: ['text-center'] }
            ]
        });
    }
}
