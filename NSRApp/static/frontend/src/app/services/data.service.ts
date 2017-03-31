/**
 * This service is responsible for fetching data from the server. Its main method
 * is 'api'. It is also responsible for default error-handling behavior if the server
 * returns an error response.
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Jsonp, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';
import { apiMap } from '../maps/api.map';
import { BusyIndicatorService } from './busy-indicator.service';
import { ModalService } from './modal.service';
import { DataEventService } from './data-event.service';
import { ApiCfg, API_CFG_DEFAULTS } from '../interfaces/apiCfg.interface';
import { ApiMap } from '../interfaces/apiMap.interface';
import { I18nPipe } from '../pipes/i18n.pipe';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

let i18n = new I18nPipe().transform;

@Injectable()
export class DataService {
    defaultHeaders = { 'Content-Type': 'application/json' };
    modalService;

    constructor(
        private http: Http,
        private bi: BusyIndicatorService,
        private dataEventService: DataEventService,
        private localStorage: LocalStorageService,
        private router: Router
    ) {
        // modalService can't be injected by normal angular DI because that will cause
        // circular DI issues (dataService -> modalService -> modalMap -> <various components> -> dataService).
        // Our workaround for this involves emitting the modalService instance to dataEventService
        // and retrieving it from there.
        this.dataEventService.observe('MODAL_SERVICE').subscribe(modalService => this.modalService = modalService);
    }

    /**
     * Communicates with the server using HTTP methods.
     */
    api(cfg: ApiCfg) {
        cfg = Object.assign({}, API_CFG_DEFAULTS, cfg);
        if (!apiMap[cfg.type]) {
            console.error('no such api type in apiMap');
            throw 'dataService.api exception';
        }
        if (this.mockupExists(cfg)) {
            return Observable.of(apiMap[cfg.type].mockup);
        }
        this.increaseBI(cfg);

        let headers = apiMap[cfg.type].headers ?
            Object.assign({}, this.defaultHeaders, apiMap[cfg.type].headers) :
            this.defaultHeaders;

        let response$ = this.http.request(new Request({
            headers: new Headers(headers),
            withCredentials: false,
            method: apiMap[cfg.type].method,
            url: this.getUrl(cfg),
            body: cfg.data
        }));
        return this.responseHandler(response$, cfg);
    }

    /**
     * Adds default headers that will appear on every HTTP request
     */
    addHeaders(headers: any) {
        Object.assign(this.defaultHeaders, headers);
    }

    /**
     * Removes default headers that will appear on every HTTP request
     */
    remHeaders(keys: string[]) {
        const currentKeys = Object.keys(this.defaultHeaders);
        keys.forEach(key => {
            if (currentKeys.indexOf(key) > -1) {
                delete this.defaultHeaders[key];
            }
        });
    }

    private responseHandler(res: Observable<any>, cfg: ApiCfg): Observable<any> {
        return res
            .take(1)
            .map(res => this.parseJson(res))
            .do(() => this.decreaseBI(cfg))
            .catch(err => this.errorHandler(err, cfg));
    }

    private errorHandler(err, cfg: ApiCfg): Observable<any> {
        let errObj = this.parseJson(err);

        this.decreaseBI(cfg);

        if (cfg.disableErrorHandler) {
            return Observable.throw(err);
        }

        let alertBody =
            errObj['detail'] ||
            this.getErrorFromObj(errObj) ||
            i18n(apiMap[cfg.type].errors && apiMap[cfg.type].errors[err.status]) ||
            i18n('errors.default' + err.status);

        return this.modalService.alert({
            body: alertBody
        }).flatMap(res => Observable.throw(res));
    }

    private getErrorFromObj(errObj) {
        if (errObj && errObj.errorCode) {
            let template = i18n('errors.' + errObj.errorCode);
            if (!errObj.params) {
                return template;
            }
            let params = {};
            // set params
            errObj.params.forEach(i => {
                switch (i.type) {
                    case 'DATE':
                        params[i.key] = moment(i.value).format('D MMMM, YYYY');
                        break;
                    case 'STRING':
                        params[i.key] = i.value;
                        break;
                    case 'ENUM':
                        params[i.key] = i18n('E.' + i.value);
                        break;
                }
            });
            return _.template(template)(params);
        }
        return false;
    }

    private getUrl(cfg: ApiCfg): string {
        let url = <string>_.template(apiMap[cfg.type].url)(cfg.urlParams || {});
        return url;
    }

    private mockupExists(cfg: ApiCfg): boolean {
        return !!apiMap[cfg.type].mockup;
    }

    private increaseBI(cfg) {
        if (!cfg.disableBI) {
            this.bi.increase();
        }
    }

    private decreaseBI(cfg) {
        if (!cfg.disableBI) {
            this.bi.decrease();
        }
    }

    private parseJson(res) {
        try {
            return res.json();
        } catch (err) {
            return res;
        }
    }
}
