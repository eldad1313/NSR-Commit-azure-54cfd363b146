/**
 * This service handles user authentication. It sets user as logged-in
 * or logged-out and it saves the user-data (user-role).
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from './data.service';
import { DataEventService } from './data-event.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {
    private token: string;
    private _user: any;

    constructor(
        private dataService: DataService,
        private dataEventService: DataEventService,
        private localStorage: LocalStorageService
    ) {
        // on startup, check local-storage if user is logged-in,
        // and log him in if so
        this.token = this.getTokenFromLocalStorage();
        if (this.token) {
            this.setLoggedIn(this.token);
        }
    }

    /**
     * Sets the user as logged-in
     */
    setLoggedIn(token: string) {
        this.token = token;
        this.addTokenToHeaders();
        this.saveTokenInLocalStorage();
    }

    /**
     * Sets the user as logged-out
     */
    setLoggedOut(): Observable<any> {
        return this.dataService.api({
            type: 'logout'
        }).do(res => this.clearToken());
    }

    clearToken() {
        this.token = undefined;
        this.remTokenFromHeaders();
        this.remTokenFromLocalStorage();
    }

    /**
     * A flag, indicating whether the user is logged-in. Will search for
     * a token in local-storage just to make sure.
     */
    get isLoggedIn(): boolean {
        if (this.token) {
            return true;
        } else {
            let savedToken = this.getTokenFromLocalStorage();
            if (savedToken) {
                this.setLoggedIn(savedToken);
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Gets or sets the user-data (user-role)
     */
    get user() {
        return this._user;
    }
    set user(val) {
        this._user = val;
        this.dataEventService.emit('USER', val);
    }

    private addTokenToHeaders() {
        this.dataService.addHeaders({
            Authorization: `Token ${this.token}`
        });
    }

    private remTokenFromHeaders() {
        this.dataService.remHeaders(['Authorization']);
    }

    private saveTokenInLocalStorage() {
        this.localStorage.set('CREDENTIALS', this.token);
    }

    remTokenFromLocalStorage() {
        this.localStorage.remove('CREDENTIALS');
    }

    private getTokenFromLocalStorage() {
        return this.localStorage.get('CREDENTIALS');
    }
}
