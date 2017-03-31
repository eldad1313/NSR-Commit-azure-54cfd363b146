/**
 * This resolver is activated whenever a user attempts to enter the app 'sys' module
 * (for example, after logging in). Only if the user is logged-in, does the resolver
 * allow the user to enter.
 * Along the way, the resolver also fetches the user-details from the server and registers
 * the intercom.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class RolePermissionsResolver implements CanActivate {

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private router: Router) { }

    canActivate(): Observable<boolean> {
        if (this.authService.isLoggedIn) {
            return this.dataService.api({
                type: 'getUserDetails'
            }).map(user => {
                this.authService.user = user;
                return true;
            }).catch(err => {
                this.authService.clearToken();
                this.router.navigate(['/login']);
                return Observable.of(false);
            });
        } else {
            console.warn('role-permissions resolver redirect to login');
            this.router.navigate(['/login']);
            return Observable.of(false);
        }
    }
}
