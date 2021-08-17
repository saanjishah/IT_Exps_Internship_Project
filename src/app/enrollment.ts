export class Enrollment {
     coursecompleted: boolean; //saves as 1 or 0
    // student_studentID:number;
    course_courseID: number ; 

    constructor(coursecompleted: boolean, course_courseID : number) {
      this.coursecompleted=coursecompleted;
      this.course_courseID=course_courseID;
    }

    // constructor(coursecompleted: boolean, student_studentID: number, course_courseID : number ) {
    //   // this.coursecompleted = coursecompleted;
    //   // this.student_studentID = student_studentID;
    //   this.course_courseID=course_courseID;
    // }
  }