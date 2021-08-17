import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';

import { CertificateComponent } from './certificate.component';


import { AddEditComponent } from './add-edit.component';
import {AddEditCourseComponent} from './add-editcourse.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        CertificateComponent,
        AddEditComponent,
        AddEditCourseComponent
    ]
})
export class UsersModule { }



// import { NgModule } from '@angular/core';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';

// import { UsersRoutingModule } from './users-routing.module';
// import { LayoutComponent } from './layout.component';
// import { ListComponent } from './list.component';

// import { CertficateComponent } from './certificate.component';

// import { AddEditComponent } from './add-edit.component';

// import { AddEditCourseComponent} from './add-editcourse.component';

// @NgModule({
//     imports: [
//         CommonModule,
//         ReactiveFormsModule,
//         UsersRoutingModule
//     ],
//     declarations: [
//         LayoutComponent,
//         ListComponent,
//         CertficateComponent,
//         AddEditComponent,
//         AddEditCourseComponent
//     ]
// })
// export class UsersModule { }