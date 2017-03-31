import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class RouteService {
    private urlObserver = null;

    constructor(
        private es: EventService,
        private localStorageService: LocalStorageService) { }

    startRecordingUrl() {
        if (!this.urlObserver) {
            this.urlObserver = this.es.observe('NAVIGATION_END').subscribe(event => {
                this.saveUrl(event.url);
            });
        }
    }

    stopRecordingUrl() {
        if (this.urlObserver) {
            this.urlObserver.unsubscribe();
            this.urlObserver = null;
        }
    }
    
    get lastNav() {
        return this.localStorageService.get('LAST_URL');
    }
    
    setMemory() {
        this.saveUrl(location.pathname);
    }

    clearMemory() {
        this.clearUrl();
    }

    private saveUrl(url) {
        this.localStorageService.set('LAST_URL', url);
    }
    
    private clearUrl() {
        this.localStorageService.remove('LAST_URL');
    }
}
