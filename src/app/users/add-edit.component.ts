import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';


import { AccountService, AlertService } from '@app/_services';
import { Student } from '@app/student';
import { HttpClient } from '@angular/common/http';

import { Course } from '@app/course';



@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    studentID:number;


    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');
    studentList: Array<Student> = [];

    // add course info to course table
    // course= new Course (1, 'Java', 'May 25 2020', 'June 30 2020');
    // courseList: Array<Course> = []




    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient 
    ) {}

    ngOnInit() {

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        if(!this.isAddMode){
            this.http.get('http://localhost:9000/students/' + this.id)
           .subscribe((students: Array<Student>) => {
            //   this.studentList = students;   //assign 
              this.student.firstname = students[0].firstname;
              this.student.lastname = students[0].lastname;
              this.student.email = students[0].email;
           });
        }
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
            this.student.firstname = "";
            this.student.lastname = "";
            this.student.email = "";
        }

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],


        });

       // this.getAllStudents();  //calling 
        // this.id = this.route.snapshot.params['id'];
        // this.isAddMode = !this.id;
        
        // // password not required in edit mode
        // const passwordValidators = [Validators.minLength(6)];
        // if (this.isAddMode) {
        //     passwordValidators.push(Validators.required);
        // }

        // this.form = this.formBuilder.group({
        //     firstName: ['', Validators.required],
        //     lastName: ['', Validators.required],
        //     username: ['', Validators.required],
        //     password: ['', passwordValidators],
        //     email: ['', Validators.required]
        //     //coursecomplete: ['', Validators.required],
        //     //completedate: ['', Validators.required],
        //     //coursedropdown: ['', Validators.required]


        // });

        // if (!this.isAddMode) {

        // //     this.http.put('http://localhost:9000/students/'+ this.student.studentID, this.student)
        // //     .subscribe(() => {
        // // this.getAllStudents();
        // //        });   
        
        // // this.router.navigate(['..', { relativeTo: this.route }]);
        // // this.alertService.success('Update successful', { keepAfterRouteChange: true });

        // //  console.log(data);
        // // //   // assign value to model
        // //   this.student.studentID = data.id;
        // //   this.student.firstname = data.firstname;
        // //   this.student.lastname = data.lastname;   
          
        //     this.accountService.getById(this.id)
        //         .pipe(first())
        //         .subscribe(x => {
        //             this.f.firstName.setValue(x.firstName);
        //             this.f.lastName.setValue(x.lastName);
        //             this.f.username.setValue(x.username);
        //             //this.f.password.setValue(x.password);

        //             //this.f.coursecomplete.setValue(x.coursecomplete);
        //             //this.f.completedate.setValue(x.completedate);
        //             //this.f.coursedropdown.setValue(x.coursedropdown);



        //         });
        // }
    }

    // Read all students records from the database
  getAllStudents(){
    this.http.get('http://localhost:9000/students')
       .subscribe((students: Array<Student>) => {
          this.studentList = students;   //assign 
       });

     }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

/// is adding set student from array but not new values;


        //this.isAddMode=true;
        // Create a student record in the database

        //alert("Firstname: "+ this.f.firstname.value + " Lastname: "+ this.f.lastname.value + " Email: "+ this.f.email.value);
        //alert(this.student.firstname);

        // this.http.put('http://localhost:9000/students/'+ this.student.firstname, this.student.lastname)
        //    .subscribe(() => {
        //        this.getAllStudents();  //calling 
        //    });

        
        //this.getAllStudents();  //calling get students. Just added.

    gotoaddcourse() {
            // alert("in method");
        this.router.navigateByUrl('/users');
    }

        
    onSubmit() {

        if (this.form.invalid) {
            this.alertService.error('Form is incomplete', { keepAfterRouteChange: true });

            return;
        }

        if(this.isAddMode){


        this.http.post('http://localhost:9000/students/', this.student)
         .subscribe(
           (res) => {
              // console.log(res);
               this.getAllStudents();
               
                  }
         );
         this.gotoaddcourse();


        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        

        this.loading = true;
        if (this.isAddMode) {
            this.createUser();
        } else {
            this.updateUser();
        }
    }else if(!this.isAddMode){
        this.http.put('http://localhost:9000/students/'+ this.id, this.student)
            .subscribe(() => {
                this.getAllStudents();  //calling 
            });

            this.gotoaddcourse();

    }

        //this.router.navigate(['../users'], { relativeTo: this.route });
       // this.router.navigate(['./users', { relativeTo: this.route }]);
    }

    private createUser() {
        // this.http.get("http://localhost:9000/addUser/students/"+ this.f.email)
        // .subscribe((students: Array<Student>) => {
            
        //     this.studentID = students[0].studentID;   //assign 
        //  });

        this.accountService.addUser(this.form.value)
        
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Student added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateUser() {
        
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private onEditClick(event:any, data:any){
        this.http.put('http://localhost:9000/students/'+ this.student.studentID, this.student)
            .subscribe(() => {
        this.getAllStudents();
               });   
        
        this.router.navigate(['..', { relativeTo: this.route }]);
        this.alertService.success('Update successful', { keepAfterRouteChange: true });

         console.log(data);
        //   // assign value to model
          this.student.studentID = data.id;
          this.student.firstname = data.firstname;
          this.student.lastname = data.lastname;   
    }

    
}