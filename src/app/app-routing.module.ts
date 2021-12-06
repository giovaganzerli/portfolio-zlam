import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// COMPONENTS
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DatasetsManagementComponent } from './pages/datasets-management/datasets-management.component';
import { ReportsManagementComponent } from './pages/reports-management/reports-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { ValidinComponent } from './pages/auth/validin/validin.component';
import { PwForgotComponent } from './pages/auth/pw-forgot/pw-forgot.component';
import { PwResetComponent } from './pages/auth/pw-reset/pw-reset.component';
import { TestsApiComponent } from './pages/tests/api/api.component';

// GUARDS
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        canActivate: [ AuthGuard ],
        data: {
            title: 'Home',
            slug: 'home'
        },
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                data: {
                    title: 'Dashboard',
                    slug: 'dashboard'
                },
            },
            {
                path: 'datasets-management',
                component: DatasetsManagementComponent,
                data: {
                    title: 'Datasets management',
                    slug: 'datasets-management'
                },
            },
            {
                path: 'reports-management',
                component: ReportsManagementComponent,
                data: {
                    title: 'Reports management',
                    slug: 'reports-management'
                },
            },
            {
                path: 'profile',
                component: UserManagementComponent,
                data: {
                    title: 'User management',
                    slug: 'user-management'
                },
            }
        ]
    },
    {
        path: 'auth',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        data: {
            title: 'Auth',
            slug: 'auth'
        },
        children: [
            {
                path: 'login',
                component: LoginComponent,
                data: {
                    title: 'Login',
                    slug: 'login'
                }
            },
            {
                path: 'signin',
                component: SigninComponent,
                data: {
                    title: 'Signin',
                    slug: 'signin'
                }
            },
            {
                path: 'validin',
                component: ValidinComponent,
                data: {
                    title: 'Validation',
                    slug: 'validin'
                }
            },
            {
                path: 'password-forgot',
                component: PwForgotComponent,
                data: {
                    title: 'Recover Password',
                    slug: 'pw_forgot'
                }
            },
            {
                path: 'password-reset',
                component: PwResetComponent,
                data: {
                    title: 'Recover Password',
                    slug: 'pw_reset'
                }
            }
        ]
    },
    {
        path: 'tests',
        data: {
            title: 'Test',
            slug: 'test'
        },
        children: [
            {
                path: 'api',
                component: TestsApiComponent,
                data: {
                    title: 'Test - API',
                    slug: 'api'
                },
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
