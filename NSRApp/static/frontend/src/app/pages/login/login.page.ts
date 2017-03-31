import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DomService } from '../../services/dom.service';
import { RouteService } from '../../services/route.service';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import * as _ from 'lodash';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    showErrors = false;
    enterPressObserver = null;

    constructor(
        private dataService: DataService,
        private router: Router,
        private authService: AuthService,
        private routeService: RouteService,
        private el: ElementRef,
        private domService: DomService,
        private localStorage: LocalStorageService) { }

    ngOnInit() {
        if (this.authService.isLoggedIn) {
            this.addLoginMask();
            this.redirectToSys().then(this.remLoginMask.bind(this));
        }
        this.setForm();
        this.startPressEnterToSubmit();
    }

    submitLogin() {
        if (this.loginForm.invalid) {
            this.showErrors = true;
            return;
        }
        this.showErrors = false;
        const requestBody = `username=${this.loginForm.value.username}&password=${this.loginForm.value.password}`;
        this.resetFormField('password');
        this.stopPressEnterToSubmit();
        this.blurDomInputs();
        this.apiRequestLogin(requestBody).subscribe(
            (res) => {
                if (!res.key) {
                    throw 'no token was provided!';
                }
                const token = res.key;
                this.authService.setLoggedIn(token);
                this.redirectToSys();
            },
            (err) => {
                this.loginForm.reset();
                this.startPressEnterToSubmit()
            });
    }

    private setForm() {
        const emailPattern = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
        this.loginForm = new FormGroup({
            username: new FormControl(null, [
                Validators.required,
                Validators.pattern(emailPattern)
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(4),
                Validators.maxLength(32)
            ])
        });
    }

    private apiRequestLogin(data) {
        return this.dataService.api({
            type: 'login',
            data: data
        });
    }

    private redirectToSys() {
        const redirectUrl = this.routeService.lastNav || '/sys';
        return this.router.navigate([redirectUrl]);
    }

    private resetFormField(fieldName: string) {
        let field = this.loginForm.get(fieldName);
        field.reset();
        field.markAsPristine();
        field.markAsUntouched();
    }

    private startPressEnterToSubmit() {
        this.enterPressObserver = this.domService.bodyEnterPress$.subscribe(event => this.submitLogin());
    }

    private stopPressEnterToSubmit() {
        this.enterPressObserver.unsubscribe();
        this.enterPressObserver = null;
    }

    private blurDomInputs() {
        this.el.nativeElement.querySelectorAll('input').forEach(el => el.blur());
    }

    private addLoginMask() {
        let mask = document.getElementsByClassName('login-mask')[0];
        if (!mask) {
            mask = document.createElement('div');
            mask.classList.add('login-mask');
            document.body.appendChild(mask);
        }
    }

    private remLoginMask() {
        let mask = document.getElementsByClassName('login-mask')[0];
        if (mask) {
            mask.remove();
        }
    }
}
