/**
 * This is the main app module where all the global declarations appear.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XSRFStrategy } from '@angular/http';
import { csrfFactory } from './app.csrf-strategy';

// routing
import { AppRoutingModule } from './app.routing';

// 3rd party
import { BootstrapModalModule } from './vendors/ng2-bootstrap-modal/index';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { PopoverModule } from 'ng2-bootstrap/popover';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { MomentModule } from 'angular2-moment';
import { DragulaModule } from 'ng2-dragula';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

// services
import { ModalService } from './services/modal.service';
import { DataService } from './services/data.service';
import { BusyIndicatorService } from './services/busy-indicator.service';
import { UtilService } from './services/util.service';
import { SessionStorageService } from './services/session-storage.service';
import { LocalStorageService } from './services/local-storage.service';
import { AuthService } from './services/auth.service';
import { DataEventService } from './services/data-event.service';
import { StaticDataService } from './services/static-data.service';
import { PrintService } from './services/print.service';
import { EventService } from './services/event.service';
import { DomService } from './services/dom.service';
import { RouteService } from './services/route.service';
import { JobService } from './services/job.service';

// pipes
import { I18nPipe } from './pipes/i18n.pipe';
import { OrdinalPipe } from './pipes/ordinal.pipe';

// components
import { AppComponent } from './app.component';
import { LoginModule } from './modules/login/login.module';
import { SysModule } from './modules/sys/sys.module';
import { LoginPage } from './pages/login/login.page';
import { IconComponent } from './components/icon/icon.component';
import { ModalWrapperComponent } from './modals/sample/modal-wrapper.component';
import { BusyIndicatorComponent } from './components/busy-indicator/busy-indicator.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { MainMenu } from './menus/main/main.menu';
import { MainMenuProfileComponent } from './components/main-menu-profile/main-menu-profile.component';
import { NotificationModalComponent } from './modals/notification/notification-modal.component';
import { MxButtonComponent } from './components/mx-button/mx-button.component';
import { MxCalendarComponent } from './components/mx-calendar/mx-calendar.component';
import { EditVisitComponent } from './modals/edit-visit/edit-visit.component';
import { MxDropDownComponent } from './components/mx-drop-down/mx-drop-down.component';
import { MxLabelComponent } from './components/mx-label/mx-label.component';
import { MxDatepickerComponent } from './components/mx-datepicker/mx-datepicker.component';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
import { MxTextareaComponent } from './components/mx-textarea/mx-textarea.component';
import { MxInputComponent } from './components/mx-input/mx-input.component';
import { MxRadioComponent } from './components/mx-radio/mx-radio.component';
import { MxCheckboxComponent } from './components/mx-checkbox/mx-checkbox.component';

// resolvers
import { RolePermissionsResolver } from './resolvers/role-permissions.resolver';
import { JobIndicatorComponent } from './components/job-indicator/job-indicator.component';
import { HomePage } from './pages/home/home.page';

@NgModule({
    declarations: [
        I18nPipe,
        OrdinalPipe,
        AppComponent,
        IconComponent,
        ModalWrapperComponent,
        BusyIndicatorComponent,
        DashboardPage,
        MainMenu,
        MainMenuProfileComponent,
        NotificationModalComponent,
        MxButtonComponent,
        MxCalendarComponent,
        EditVisitComponent,
        MxDropDownComponent,
        MxLabelComponent,
        MxDatepickerComponent,
        ErrorHandlerComponent,
        MxTextareaComponent,
        MxInputComponent,
        MxRadioComponent,
        LoginPage,
        SysModule,
        LoginModule,
        MxCheckboxComponent,
        JobIndicatorComponent,
        HomePage
    ],
    // modal components must appear here
    entryComponents: [
        ModalWrapperComponent,
        NotificationModalComponent,
        EditVisitComponent
    ],
    imports: [
        BootstrapModalModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        DropdownModule.forRoot(),
        MomentModule,
        AppRoutingModule,
        DragulaModule,
        PopoverModule.forRoot(),
        InfiniteScrollModule,
        TooltipModule.forRoot()
    ],
    providers: [
        DataService,
        ModalService,
        BusyIndicatorService,
        UtilService,
        SessionStorageService,
        LocalStorageService,
        DataEventService,
        StaticDataService,
        AuthService,
        RouteService,
        JobService,
        PrintService,
        DomService,
        EventService,
        RolePermissionsResolver,
        { provide: XSRFStrategy, useFactory: csrfFactory }, // to conform with Django's CSRF token strategy
    ],
    // the app starts loading with the AppComponent
    bootstrap: [AppComponent]
})
export class AppModule { }
