import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import{users} from '@app/users';
import { throwError } from 'rxjs';

@Component({ templateUrl: 'adminregister.component.html' })
export class AdminRegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    accountTaken:boolean;

    adminUser = new users(0,'Admin', 'Teacher');

    usernames: Array<users>= [];

   // http: any;

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
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            vcode: ['', Validators.required]

        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if(this.f.vcode.value=="admin"){
            this.adminUser.ID = 0;
            this.adminUser.username = this.f.username.value;
            this.adminUser.password = this.f.password.value;

            this.http.get('http://localhost:9000/admin/username')
           .subscribe((username: Array<users>) => {
                this.usernames=username;
             // this.username = ;   //assign 
             for(var i=0; i<this.usernames.length;i++){
               // alert(this.usernames[i].username);
                 if(this.usernames[i].username==this.adminUser.username){
                     this.accountTaken=true;
                     //alert("Username taken");
                     break;
                     //return throwError("Username is already taken");
 
                 }
            }
            //alert(this.accountTaken);

           if(!this.accountTaken){
               this.accountService.register(this.form.value, 0)
            .pipe(first())
            .subscribe(
                data => {
                   // alert("admin localstorage register");
                    //this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    //this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

                this.http.post('http://localhost:9000/users/', this.adminUser)
                .subscribe(
  
                (res) => {
                    console.log("complete");
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                     this.router.navigate(['../login'], { relativeTo: this.route });
                }
                );

                
            } else{
                this.alertService.error('Registration Failed. Username is taken.', { keepAfterRouteChange: true });
            }
             
           });

           //this.accountTaken=false;

        //    for(var i=0; i<this.username.length;i++){
        //        alert(this.username[i]);
        //         if(this.username[i]==this.adminUser.username){
        //             this.accountTaken=true;
        //             alert("Username taken");
        //             break;
        //             //return throwError("Username is already taken");

        //         }
        //    }

        //    alert(this.accountTaken);

        //    if(!this.accountTaken){
        //         this.http.post('http://localhost:9000/users/', this.adminUser)
        //         .subscribe(
  
        //         (res) => {
        //             console.log("complete");
        //             this.alertService.success('Registration successful', { keepAfterRouteChange: true });

        //             this.router.navigate(['../login'], { relativeTo: this.route });

        //         }
        //         );

        //     }
           }else{
             //  alert("verification code is incorrect");
            this.alertService.error('Verification code is incorrect', { keepAfterRouteChange: true });

            return throwError("Verification code is incorrect");

            //return  ("Verification code is incorrect");

           }
            

        // Begins to check if entered verifcation code is correct
        //alert("vcode: "+this.f.vcode.value);
        // this.accountService.adminRegistration(this.f.vcode.value, this.form.value) // added this.form.value
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        //             this.router.navigate(['../login'], { relativeTo: this.route });
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });      
        
        //////////////////////

        

        // this.loading = true;
        // this.accountService.register(this.form.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        //             this.router.navigate(['../login'], { relativeTo: this.route });
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });


   }
}