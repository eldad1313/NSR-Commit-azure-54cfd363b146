import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {

    constructor() { }

    set(id, val) {
        sessionStorage.setItem(id, JSON.stringify(val));
    }

    get(id) {
        let val = sessionStorage.getItem(id);
        return val ? JSON.parse(val) : null;
    }

    remove(id) {
        sessionStorage.removeItem(id);
    }

    clear() {
        sessionStorage.clear();
    }

}
