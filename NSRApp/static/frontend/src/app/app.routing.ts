/**
 * This module defines all the app routes and their dynamics
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysModule } from './modules/sys/sys.module';
import { LoginModule } from './modules/login/login.module';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { RolePermissionsResolver } from './resolvers/role-permissions.resolver';

const appRoutes: Routes = [
    {
        path: 'sys',
        component: SysModule,
        // canActivate: [RolePermissionsResolver],
        children: [
            // {
            //     path: 'assignments',
            //     component: AssignmentsPage,
            //     children: [
            //         {
            //             path: 'mapView',
            //             component: AssignmentsMapViewComponent
            //         },
            //         {
            //             path: '**',
            //             component: AssignmentsViewComponent
            //         }
            //     ]
            // },

            {
                path: 'home',
                component: HomePage
            },
            {
                path: '**',
                redirectTo: 'home'
            }
        ]
    },
    {
        path: 'login',
        component: LoginModule,
        children: [
            {
                path: 'login',
                component: LoginPage
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'sys/home'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
