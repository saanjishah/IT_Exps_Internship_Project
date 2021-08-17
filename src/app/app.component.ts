import { Component, OnInit} from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

import {Student} from './student';
import {Course} from './course';
import {Enrollment} from './enrollment';
//import {Adminusers} from './adminusers';
import {users} from './users';
import {CertGeneratorLog} from './certgeneratorlog';



import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
//import {Router, ActivateRoute}: from '@angular/router';

//import { RouterLinkActive } from '@angular/router';


@Component({ selector: 'app', templateUrl: 'app.component.html' })

export class AppComponent implements OnInit{
    submitted=false;

    user: User;
    isEnabled=true;

    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');
    studentList: Array<Student>= [];

    course= new Course (25,'MS Project', 'June 20 2020', 'July 5 2020');
    courseList: Array<Course> = [];

    studentData: JSON;
    id: any;


    constructor(private accountService: AccountService, private http: HttpClient, private route: ActivatedRoute,
        private router: Router) {
        this.accountService.user.subscribe(x => this.user = x);

        

        //private route: ActivatedRoute,
        //private router: Router,
    }

    // Read all students records from the database
    // getAllStudents(){
    //     this.http.get('http://localhost:9000/students')
    //     .subscribe((students: Array<Student>) => {
    //     this.studentList = students;   //assign 
    //    });
    // }


    onSubmit(){  
         //Calling REST Service
    //   this.http.post('http://localhost:9000/students/', this.student)
    //   .subscribe(
    //     (res) => {
    //        // console.log(res);
    //         this.getAllStudents();
    //            }
    //   );

    }




    logout() {
        this.accountService.logout();
    }

    login(userId:Number){
        this.id = userId;
       // alert("App component: "+this.id);

        if(this.id==0){
            this.isEnabled=true;
        } else{
            this.isEnabled=false;
        }
    }

    ngOnInit(){  
        //alert("hi");
        // this.id = this.route.snapshot.params['id'];
        // alert("App component: "+this.id);
      //  this.getAllStudents();
        //alert("Id: " + this.user.id);

            if(this.user.id=="0"){
                this.isEnabled=true;
            } else{
                this.isEnabled=false;
            }
    }

    
    
}

// function error(message) {
//     return throwError({ error: { message } });
