import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

import { CertificateComponent } from './certificate.component';

import { AddEditComponent } from './add-edit.component';

import {AddEditCourseComponent} from './add-editcourse.component';

import { HomeComponent } from '@app/home';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'add', component: AddEditComponent },
            { path: 'edit/:id', component: AddEditComponent },
            { path: 'addcourse', component: AddEditCourseComponent },
            { path: 'addcourse/:id', component: AddEditCourseComponent },

           // { path: '/userspage', component: ListComponent },
            { path: 'coursepage', component: CertificateComponent },
            { path: 'coursepage/:id', component: CertificateComponent }
            //{ path: 'homepage', component: HomeComponent},




        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }