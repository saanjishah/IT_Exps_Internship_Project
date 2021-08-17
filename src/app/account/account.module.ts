import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';

import {AdminRegisterComponent} from './adminregister.component';
import {StudentRegisterComponent} from './studentregister.component';

import { ForgotPasswordComponent} from './forgot-password.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
        StudentRegisterComponent,
        AdminRegisterComponent,
        ForgotPasswordComponent
    ]
})
export class AccountModule { }