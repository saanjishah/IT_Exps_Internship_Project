import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { StudentRegisterComponent } from './studentregister.component';
import { AdminRegisterComponent } from './adminregister.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { HomeComponent } from '@app/home';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'registerasstudent', component: StudentRegisterComponent },
            { path: 'registerasadmin', component: AdminRegisterComponent },
            { path: 'forgotpassword', component: ForgotPasswordComponent },
            { path: 'homepage', component: HomeComponent}

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }