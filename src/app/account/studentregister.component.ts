import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { HttpClient } from '@angular/common/http';
import { Student } from '@app/student';
import { users } from '@app/users';

//import{Studentusers} from '@app/studentusers';

@Component({ templateUrl: 'studentregister.component.html' })
export class StudentRegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    // studentUser= new Studentusers (1, 'Mike', 'Smith' , 'Mike1' ,'123456', true);
    // studentUserList: Array<Studentusers> = [];

    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');
    studentList: Array<Student> = [];

    studentIndex:number;
    //allStudents: Array<users>= [];
    // newID: Number;
    // nextID:Number;
    // newStudentID: Number;

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
          //  firstName: ['', Validators.required],
          //  lastName: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
            
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    // getAllStudents(){
    //     this.http.get('http://localhost:9000/students')
    //        .subscribe((studentUsers: Array<Studentusers>) => {
    //           this.studentUserList = studentUsers;   //assign 
    //        });
    
    //      }

    onSubmit() {
        
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.http.get('http://localhost:9000/students')
           .subscribe((students: Array<Student>) => {
             //  alert("get");
                this.studentList=students;
                //this.newID=this.allUsers[0].ID;
             // this.username = ;   //assign 
            //this.loginTrue=true;
           // alert(this.allUsers.username.includes(this.f.username.value));
            //alert(this.allUsers.includes(this.f.password.value));


             for(var i=0; i<this.studentList.length;i++){
                if(this.studentList[i].email==this.f.email.value){
                    this.studentIndex=i;
                    //alert("StudentIndex: "+ this.studentIndex);
                    break;
                } 
            }

            if(this.studentIndex==undefined){
                this.alertService.error('Admin must add account first', { keepAfterRouteChange: true });

            } else{

                //alert("Stu ID: "+ this.studentList[this.studentIndex].studentID);

                this.accountService.register(this.form.value, this.studentList[this.studentIndex].studentID)
            .pipe(first())
            .subscribe(
                data => {
                    this.http.post('http://localhost:9000/users/', {'ID': (this.studentList[this.studentIndex].studentID), 'username': this.f.username.value, 'password': this.f.password.value})
                .subscribe(
                (res) => {
                    console.log("complete");
                   // alert("registration success");
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                     this.router.navigate(['../login'], { relativeTo: this.route });

                  }
                );
                    //alert("registered to local storage")
                  //  this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                   // this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

            // this.http.post('http://localhost:9000/users/', {'ID': (this.studentList[this.studentIndex].studentID), 'username': this.f.username.value, 'password': this.f.password.value})
            //     .subscribe(
            //     (res) => {
            //         console.log("complete");
            //        // alert("registration success");
            //         this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            //          this.router.navigate(['../login'], { relativeTo: this.route });

            //       }
            //     );

            }

        

            // this.accountService.register(this.form.value)
            // .pipe(first())
            // .subscribe(
            //     data => {
            //         alert("registered to local storage")
            //       //  this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            //        // this.router.navigate(['../login'], { relativeTo: this.route });
            //     },
            //     error => {
            //         this.alertService.error(error);
            //         this.loading = false;
            //     });

            // this.http.post('http://localhost:9000/users/', {'ID': (this.studentList[this.studentIndex].studentID), 'username': this.f.username.value, 'password': this.f.password.value})
            //     .subscribe(
            //     (res) => {
            //         console.log("complete");
            //        // alert("registration success");
            //         this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            //          this.router.navigate(['../login'], { relativeTo: this.route });

            //       }
            //     );

           
   
             
           });




        // this.http.post('http://localhost:9000/studentusers/', this.studentUser)
        //  .subscribe(
        //    (res) => {
        //       // console.log(res);
        //        this.getAllStudents();
        //           }
        //  );


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