import { Component, OnInit } from '@angular/core';
import { first, timestamp } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Student } from '@app/student';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Course } from '@app/course';

import {Router, ActivatedRoute} from '@angular/router';
import { Enrollment } from '@app/enrollment';
import { CertGeneratorLog } from '@app/certgeneratorlog';
import { Course2 } from '@app/course2';

@Component({ templateUrl: 'certificate.component.html' })
export class CertificateComponent implements OnInit {
    users = null;
    studID:Number;

    courseList2: Array<Course>=[];
    enrollList2: Array<Enrollment>=[];


    course= new Course (25,'MS Project', 'June 20 2020', 'July 5 2020');
    courseList: Array<Course> = [];
    //studentList=null;

    displayCourseList: Array<Course2> = [];
    // Student=[];
    // Course=[];
    // Enrollment=[];

    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');
    StudentList: Array<Student> = [];

    certificateList: Array<String> = [];

    enrolled = new Enrollment(true,5); 
    enrollList: Array<Enrollment> = [];
    employeeData: string;

    courseURL: Array<Number> = [];

    // certgeneratorlog = new CertGeneratorLog ('123', 3, 5);
    certGenerateList: Array<CertGeneratorLog>=[];

    courseCompleted: string;
    httpClient: any;

    fname:string;
    lname:string;
    studentID:string;
    coursename:string;
    enddate:string;
    ccomplete:string;

//private router:Router

    constructor(private accountService: AccountService, private http: HttpClient, private route: ActivatedRoute, public router:Router, private alertService: AlertService,
        ) {}

    ngOnInit() {

        this.studID= this.route.snapshot.params['id'];

        this.getAllCourses();
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

    showLink(courseID: Number){
        console.log(this.studID);
        this.courseURL.push(this.studID);
        this.courseURL.push(courseID);

        this.certificateList.splice(0,this.certificateList.length);

       // var URL=JSON.stringify(this.courseURL);

    // //var querystring = require('querystring');
    //     alert(this.courseURL);
    //     alert(JSON.stringify(this.courseURL))
      //  console.log(this.certificateList.length);
        // this.http.get('http://localhost:9000/certificate/certgeneratorlog/' + this.studID + courseID) //querystring.stringify({'courseURL':JSON.stringify(this.courseURL)}
        //  // this.courseURL
        //    .subscribe((link: Array<CertGeneratorLog>) => {
        //         console.log(this.studID);
        //         console.log(courseID);
        //        //console.log("show link: "+link[0].CertificateURL);
        //        if(link.length == 0){
        //             this.alertService.error('Certificate Has Not Been Generated', { keepAfterRouteChange: true });
        //        }else{
        //         this.certificateList.push(link[0].CertificateURL);
        //        }
               
        //        //this.router.navigate([link[0].CertificateURL]);
        //    });

       // alert("Certif: "+this.certificateList[0]);

       this.http.get('http://localhost:9000/certgeneratorlog/studentInfo/' + this.studID) //querystring.stringify({'courseURL':JSON.stringify(this.courseURL)}
       // this.courseURL
         .subscribe((info: Array<CertGeneratorLog>) => {
              this.certGenerateList = info;
              for(var i = 0; i<this.certGenerateList.length; i++){
                  if(this.certGenerateList[i].course_courseID == courseID){
                    this.certificateList.push(this.certGenerateList[i].CertificateURL);
                  }
              }
             
             //this.router.navigate([link[0].CertificateURL]);
         });

    }

    gotoaddcourse(){
        //alert("in method");
        this.router.navigate(['/users/addcourse/'+ this.studID]);

    }

    getAllCourses(){

        this.enrollList.splice(0,this.enrollList.length);
        this.courseList.splice(0,this.courseList.length);
        this.displayCourseList.splice(0,this.displayCourseList.length);

        this.http.get('http://localhost:9000/enrollment/' + this.studID)
           .subscribe((IDs: Array<Enrollment>) => {
              this.enrollList = IDs;   //assign 
            
            for (var i = 0; i< this.enrollList.length;i++){

                this.http.get('http://localhost:9000/course/' + this.enrollList[i].course_courseID)
                .subscribe((courses: Array<Course>) => {
                    this.courseList.push(courses[0]);   //assign 

                });

            }

            this.http.get('http://localhost:9000/certgeneratorlog/studentInfo/' + this.studID) //querystring.stringify({'courseURL':JSON.stringify(this.courseURL)}
            // this.courseURL
            .subscribe((info: Array<CertGeneratorLog>) => {
                this.certGenerateList = info;
                for (var i = 0; i< this.courseList.length; i++){
                    var courseDisplay= new Course2 (25,'MS Project', 'June 20 2020', 'July 5 2020', true);
                    courseDisplay.courseID = this.courseList[i].courseID;
                    courseDisplay.coursename = this.courseList[i].coursename;
                    courseDisplay.courseenddate = this.courseList[i].courseenddate;
                    courseDisplay.coursestartdate = this.courseList[i].coursestartdate;
                    courseDisplay.hasCertGen = false
                    for(var j = 0; j<this.certGenerateList.length; j++){
                        if(this.certGenerateList[j].course_courseID == this.courseList[i].courseID){
                            courseDisplay.hasCertGen = true;
                            break;
                        }
                    }
                    this.displayCourseList.push(courseDisplay);
                }
                
             
                //this.router.navigate([link[0].CertificateURL]);
            });
        });
    
        }
    

    deleteEnroll(courseID: Number) { //added this
        console.log("StudentID: "+ this.studID);
        console.log("Delete courseID: "+ courseID);
        // let params = new HttpParams();
        // params = params.append('studentID', String(this.studID));
        // params = params.append('courseID', String(courseID));
        // const opts = { params: new HttpParams({fromString: "student_studentID=" + this.studID + "&course_courseID=" + courseID}) };
        //  this.http.delete('http://localhost:9000/enrollment/'+ opts)
         this.http.delete('http://localhost:9000/enrollment/'+ this.studID + '/' + courseID)
            .subscribe(
                (res) => {
                
            this.getAllCourses();
            }
        );

    }

     onEditClick(courseID: number){
        //alert("Edit CourseID: "+ courseID);
        this.http.put('http://localhost:9000/course/'+ courseID, this.course)
            .subscribe(() => {
        this.getAllCourses();
        });

    }
    

    onCertGenerate(courseID: number){
        //alert("studID: "+ this.studID);

        this.http.get('http://localhost:9000/students/' + this.studID)
        .subscribe((info: Array<Student>) => {
           this.StudentList = info;   //assign 
           console.log(info);
           console.log(this.StudentList);

            console.log(this.StudentList[0].firstname);
            console.log(this.StudentList[0].lastname);
            
            this.fname=this.StudentList[0].firstname;
            this.studentID=this.StudentList[0].studentID.toString();
            this.lname=this.StudentList[0].lastname;


        console.log(courseID);
        console.log(this.fname);
        this.http.get('http://localhost:9000/course/' + courseID)
        .subscribe((info: Array<Course>) => {
           this.courseList2 = info;   //assign 
           console.log(this.courseList2[0].coursename);
           console.log(this.courseList2[0].courseenddate);

           this.coursename=this.courseList2[0].coursename;
           this.enddate=this.courseList2[0].courseenddate;


        console.log(courseID);
        this.http.get('http://localhost:9000/enrollment/course/' + courseID)
        .subscribe((info: Array<Enrollment>) => {
           this.enrollList2 = info;   //assign
           console.log(info); 
            if(this.enrollList2[0].coursecompleted == true){
                this.courseCompleted="True";
            } else{
                this.courseCompleted="False";
            }
            
            this.ccomplete=this.courseCompleted;      

//         });

//     });

// });
            console.log(this.fname);
            console.log(this.lname);
            console.log(this.studentID);
            console.log(this.coursename);
            console.log(this.enddate);
            console.log(this.ccomplete);

            if(this.ccomplete=="True"){
            
            this.fname = "\"" + this.fname + "\""
            this.lname = "\"" + this.lname + "\""
            this.studentID = "\"" + this.studentID + "\""
            this.coursename = "\"" + this.coursename + "\""
            this.enddate = "\"" + this.enddate + "\""
            this.ccomplete = "\"" + this.ccomplete + "\""

                let params = new HttpParams();

            params = params.append('fname', this.fname);
            params = params.append('lname', this.lname);
            params = params.append('studentID', this.studentID);

            params = params.append('coursename', this.coursename);
            params = params.append('enddate', this.enddate);
            params = params.append('ccomplete', this.ccomplete);

            console.log(params);
            // console.log("hi");

            this.http.get('https://murh4kx71e.execute-api.us-east-2.amazonaws.com/test/certificate',{params: params})
            .subscribe(data => {
                this.employeeData = data as string;
                console.log(this.employeeData);
                console.log("url ^");
                // this.certGenerateList.push(this.employeeData,this.studID,courseID); 
                //this.employeeData.stringify;
                if(this.employeeData!="exists"){
                    this.http.post('http://localhost:9000/certgeneratorlog/', {'CertificateURL': this.employeeData, 'student_studentID': this.studID, 'course_courseID':courseID})
                    .subscribe(
                    (res) => {
                    // console.log("complete");
                    this.alertService.success('Certificate Generated Successfully', { keepAfterRouteChange: true });
                    this.enrollList.splice(0,this.enrollList.length);
                    this.courseList.splice(0,this.courseList.length);
                    this.displayCourseList.splice(0,this.displayCourseList.length);

                    this.getAllCourses();
                  }
                );
                }else{
                   // alert("certificate exists");
                    this.alertService.error('Certificate Already Exists, Click on Link to view image.', { keepAfterRouteChange: true });
                    // this.enrollList.splice(0,this.enrollList.length);
                    // this.courseList.splice(0,this.courseList.length);
                    // return; 
                }

                

                })

            }else{
                alert("Course is incomplete");
            }
            
            
                

            });

            });

        });  

        
    }

    
}