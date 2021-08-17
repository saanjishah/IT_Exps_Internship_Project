import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';


import { AccountService, AlertService } from '@app/_services';
import { Student } from '@app/student';
import { HttpClient } from '@angular/common/http';

import { Course } from '@app/course';
import { Enrollment3 } from '@app/enrollment3';
import { Enrollment } from '@app/enrollment';



@Component({ templateUrl: 'add-editcourse.component.html' })
export class AddEditCourseComponent implements OnInit {
    form: FormGroup;
    studID: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    //completedBool: boolean;

    enrolledCourse:boolean;

    course= new Course (25,'MS Project', 'June 20 2020', 'July 5 2020');
    courseList: Array<Course> = [];

    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');

    enrollment= new Enrollment3(1,5,1);
    courseSelected: Array<Number>=[];


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient 
    ) {}

    onCheckboxChagen(checked:Boolean, ID:number) {

    if (checked) {

        this.http.get('http://localhost:9000/enrollment/' + this.studID)
        .subscribe((courses: Array<Enrollment>) => {
        if(courses.length!=0){
            for(var i=0;i<courses.length;i++){
                if(courses[i].course_courseID==ID){
                    this.alertService.error('Student is already enrolled in course', { keepAfterRouteChange: true });
                    this.enrolledCourse=true;
                    break;
                } else{
                    this.enrolledCourse=false;
                }

            }
        }
           
        });

        if(!this.enrolledCourse){
        //    alert(ID);
            this.courseSelected.push(ID);
        }

        
      } 
      // if (!event.checked) {
  
      // //   let index = this.interests.indexOf(value);
      // }
    }
    // selectChangeHandler (event: any) {
    //   //update the ui
    //   if(event.target.value == "yes"){
    //       this.completedBool = true;
    //   }else{
    //       this.completedBool = false;
    //   }
    //   //alert(this.completedBool);
    // }



    ngOnInit() {
       // this.getAllStudents();  //calling 
        this.studID = this.route.snapshot.params['id'];
        this.isAddMode = !this.studID;
        
        // password not required in edit mode
        //const passwordValidators = [Validators.minLength(6)];
        //if (this.isAddMode) {
        //    passwordValidators.push(Validators.required);
        //}

        this.http.get('http://localhost:9000/course')
        .subscribe((courses: Array<Course>) => {
           this.courseList = courses;   //assign 
        });


        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
           // password: ['', passwordValidators],
            email: ['', Validators.required]



        });

        // if (!this.isAddMode) {

    
    }

    // Read all students records from the database
  getAllCourses(){
    this.http.get('http://localhost:9000/enrollment/' + this.studID)
    .subscribe((IDs: Array<Enrollment>) => {
     //   this.enrollList = IDs;   //assign 
     
       for (var i = 0; i< IDs.length;i++){
         //alert(IDs[i].course_courseID);

         this.http.get('http://localhost:9000/course/' + IDs[i].course_courseID)
         .subscribe((courses: Array<Course>) => {
             this.courseList = courses;   //assign 
             // this.courseList = [...courses];
            //  for (var i = 0; i< this.courseList.length;i++){
            //      alert(this.courseList[i].coursename);
            //      // this.courseIDList.push(this.courseList[i].courseID);
            //      // this.courseNameList.push(this.courseList[i].coursename);
            //   }
         });

      }
    });


     }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

/// is adding set student from array but not new values;

    gotoaddcourse() {

        this.router.navigate(['/users/coursepage/'+this.studID]);
    }


    onSubmit() {

        if (this.courseSelected.length==0) {
            this.alertService.error('Please select a course', { keepAfterRouteChange: true });
            return;
        }

        if(!this.enrolledCourse){

        for (var i = 0; i< this.courseSelected.length;i++){
            this.enrollment.course_courseID = this.courseSelected[i];
            //alert("stuID String: " + this.studID);
            this.enrollment.student_studentID = parseInt(this.studID);
           // alert("stuID in enrollment param: " + this.enrollment.student_studentID);
           // if(this.completedBool){
                this.enrollment.coursecompleted = 1;
            // }else{
            //     this.enrollment.coursecompleted = 0;
            // }
        
            this.http.post('http://localhost:9000/enrollment/', this.enrollment)
            .subscribe(
                (res) => {
                console.log(res);
                // this.getAllStudents();
                }
            );
        }
        
    } 

    this.gotoaddcourse();

        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        
        this.loading = true;

      //  this.router.navigate(['./users', { relativeTo: this.route }]);
       
    }

    // private createUser() {
    //     this.accountService.register(this.form.value)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 this.alertService.success('User added successfully', { keepAfterRouteChange: true });
    //                 this.router.navigate(['.', { relativeTo: this.route }]);
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             });
    // }

    // private updateUser() {
        
    //     this.accountService.update(this.id, this.form.value)
    //         .pipe(first())
    //         .subscribe(
    //             data => {
    //                 this.alertService.success('Update successful', { keepAfterRouteChange: true });
    //                 this.router.navigate(['..', { relativeTo: this.route }]);
    //             },
    //             error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             });
    // }

    // private onEditClick(event:any, data:any){
    //     this.http.put('http://localhost:9000/course/'+ this.course.courseID, this.course)
    //         .subscribe(() => {
    //     this.getAllCourses();
    //            });   
        
    //     this.router.navigate(['..', { relativeTo: this.route }]);
    //     this.alertService.success('Update successful', { keepAfterRouteChange: true });

    //      console.log(data);
    //     //   // assign value to model
    //       this.course.courseID = data.id;
    //       this.course.coursename = data.firstname;
    //       this.course.coursestartdate = data.lastname;   
    // }

    
}