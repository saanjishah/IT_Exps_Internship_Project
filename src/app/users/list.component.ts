import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Student } from '@app/student';

import { HttpClient } from '@angular/common/http';
import { users } from '@app/users';


@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;

    student= new Student (1, 'Derek', 'Hills', 'derekhills@abc.com');
    studentList: Array<Student> = [];

    student1: Array<users> = [];



    //studentList=null;

    constructor(private accountService: AccountService, private http: HttpClient ) {}

    getAllStudents(){
    
        this.http.get('http://localhost:9000/students')
           .subscribe((students: Array<Student>) => {
              this.studentList = students;   //assign 
           });
    
           //this.createUser();
    
         }

    ngOnInit() {
        this.getAllStudents();
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }

           // alert("Number: "+ id);

    deleteUser2(studentID: number) {

        // this.http.get('http://localhost:9000/users/' + studentID)
        // .subscribe((info : Array<users>) => {
        //     this.student1 = info;
        // });

        //alert("Delete studentID: "+ studentID);
        this.http.delete('http://localhost:9000/students/'+ studentID)
            .subscribe(() => {

               
        this.getAllStudents();
        });

    //     this.http.put('http://localhost:9000/delete/users/'+ studentID, this.student1)
    //     .subscribe(() => {
    //         alert("getAllStudents list.component");
    //         this.getAllStudents();
    // });



        // this.http.put('http://localhost:9000/delete/users/'+ studentID, this.student)
        //     .subscribe(() => {
        //         this.getAllStudents();
        // });

        // this.http.put('http://localhost:9000/users/'+ studentID)
        // .subscribe(() => {
        //     //this.getAllStudents();
        //     });

        // this.http.delete('http://localhost:9000/users/'+ studentID)
        //     .subscribe(() => {
        // this.getAllStudents();
        // });


    }

     onEditClick(studentID: number){
        //alert("Edit StudentID: "+ studentID);
        this.http.put('http://localhost:9000/students/'+ studentID, this.student)
            .subscribe(() => {
        this.getAllStudents();
        });

        // console.log(data);
        //   // assign value to model
        //   this.student.studentID = data.id;
        //   this.student.firstname = data.firstname;
        //   this.student.lastname = data.lastname;   
    }

    
}