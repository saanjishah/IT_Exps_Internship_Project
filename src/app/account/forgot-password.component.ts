import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

import { HttpClient, HttpParams } from '@angular/common/http';



@Component({ templateUrl: 'forgot-password.component.html' })
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient

    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]

            
        });
    }

    // convenience getter for easy access to form fields

    // getAllStudents(){
    //     this.http.get('http://localhost:9000/students')
    //        .subscribe((students: Array<Student>) => {
    //           this.studentList = students;   //assign 
    //        });
    
    //      }

    // editPassword() {

    //     this.http.post('http://localhost:9000/students/', this.student)
    //      .subscribe(
    //        (res) => {
    //           // console.log(res);
    //            this.getAllStudents();
    //               }
    //      );
    // }


    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

         this.loading = true;
         this.accountService.forgotPasswordCheck(this.f.username.value, this.f.password.value, this.f.confirmPassword.value) // added this.form.value
            .pipe(first())
            .subscribe(
                data => {
                    // this.http.put('http://localhost:9000/users/'+ this.f.username.value + this.f.password.value)
                    //     .subscribe(() => {
                    //         alert("put username");
                    //     //this.getAllCourses();
                    // }); 

                    this.alertService.success('Password update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}