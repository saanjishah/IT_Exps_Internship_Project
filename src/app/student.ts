export class Student {
    studentID: number;
    firstname: string;
    lastname: string ;
    email: string;

    constructor(studentID:number, firstname: string, lastname: string, email: string ) {
      this.studentID=studentID;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email= email;
    }
  }