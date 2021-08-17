import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import{users} from '@app/users';
import { HttpClient } from '@angular/common/http';



@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    index:number;

    usernameArr: Array<String>=[];
    passwordArr: Array<String>=[];

    allUsers: Array<users>= [];

    loginTrue:boolean;

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
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
        //alert("hello");

        this.http.get('http://localhost:9000/userinfo')
           .subscribe((userInfo: Array<users>) => {
             //  alert("get");
                this.allUsers=userInfo;
             // this.username = ;   //assign 
            //this.loginTrue=true;
           // alert(this.allUsers.username.includes(this.f.username.value));
            //alert(this.allUsers.includes(this.f.password.value));


             for(var i=0; i<this.allUsers.length;i++){
                 this.usernameArr.push(this.allUsers[i].username);
               //  alert(this.allUsers[i].password);
                 this.passwordArr.push(this.allUsers[i].password);



                // alert(this.allUsers[i].username);
                // //this.allUsers.includes(this.f.username.value);

                //  if(this.allUsers[i].username==this.f.username.value){
                //     this.loginTrue=true;
                //     if(this.allUsers[i].password==this.f.password.value){
                //         this.loginTrue=true;
                //     } else{
                //         this.loginTrue=false;

                //     }
         
                //      //this.allUsers=true;
                //      //alert("Username taken");
                //      //break;
                //      //return throwError("Username is already taken");
 
                //  }  else{
                //     this.loginTrue=false;

                // }
            }

            if(this.usernameArr.includes(this.f.username.value)){
                this.index=this.usernameArr.indexOf(this.f.username.value);
              //  alert(this.index);
               // alert(this.usernameArr[this.index]);
               // alert(this.passwordArr[this.index]);

                if(this.passwordArr[this.index]==this.f.password.value){
                    this.loginTrue=true;
                } else{
                    this.loginTrue=false;
                }
            } else{
                this.loginTrue=false;
            }
            //alert(this.loginTrue);

    

            if(this.loginTrue){
                //alert("success");
                //this.loading=true;
                //alert("login INdex: "+this.index);
                //alert(this.allUsers[this.index].ID);
                //this.router.navigate(['app/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });
                //this.router.navigate([this.returnUrl]);

                //  this.router.navigate(['/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });

//                this.router.navigateByUrl('/app/homepage/'+ this.allUsers[this.index].ID);
               // this.router.navigate([this.returnUrl]);
               //this.id = this.route.snapshot.params['id'];

               //    alert(this.allUsers[this.index].ID);

        //         //this.router.navigate(['/app/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });

                // this.loading = true;
                // this.accountService.login(this.f.username.value, this.f.password.value, this.allUsers[this.index].ID)
                // .pipe(first())
                // .subscribe(
                // data => {
                //    // alert("route to home");
                //     alert("login URL: "+ this.returnUrl)
                //     alert("homepage: "+ this.allUsers[this.index].ID)
                //                     //this.router.navigate(['/app/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });
                   
                //     this.router.navigate(['homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });

                //     //this.router.navigate([this.returnUrl]);
                // },
                // error => {
                //     alert("incorrect");
                //     this.alertService.error(error);
                //     this.loading = false;
                // });
                
                this.loading = true;
            this.accountService.login(this.f.username.value, this.f.password.value, this.index)
            .pipe(first())
            .subscribe(
                data => {
                    //alert("URL: "+ this.returnUrl);
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });


            } else{

                //alert("Wrong username or password");
                //this.f.username.untouched;
                //this.f.password.untouched;
                this.alertService.error('Incorrect username or password', { keepAfterRouteChange: true });
                
               // this.alertService.error("Wrong username or password");
            }

            // this.loading = true;
            // this.accountService.login(this.f.username.value, this.f.password.value)
            // .pipe(first())
            // .subscribe(
            //     data => {
            //         alert("URL: "+ this.returnUrl);
            //         this.router.navigate([this.returnUrl]);
            //     },
            //     error => {
            //         this.alertService.error(error);
            //         this.loading = false;
            //     });
             
           });




        //    alert(this.allUsers[this.index].ID);

        //         //this.router.navigate(['/app/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });

        //         this.loading = true;
        //         this.accountService.login(this.f.username.value, this.f.password.value, this.allUsers[this.index].ID)
        //         .pipe(first())
        //         .subscribe(
        //         data => {
        //             alert("route to home");
        //                             //this.router.navigate(['/app/homepage/'+ this.allUsers[this.index].ID], { relativeTo: this.route });

        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             alert("incorrect");
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });



        // this.loading = true;
        // this.accountService.login(this.f.username.value, this.f.password.value,)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
                    
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });

    }
}