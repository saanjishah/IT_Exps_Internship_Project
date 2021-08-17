export class Enrollment3 {
     coursecompleted: Number; //saves as 1 or 0
     student_studentID:Number;
     course_courseID: Number ; 

    constructor(coursecompleted: Number, student_studentID:Number, course_courseID : Number) {
      this.coursecompleted=coursecompleted;
      this.student_studentID= student_studentID;
      this.course_courseID=course_courseID;
    }

    // constructor(coursecompleted: boolean, student_studentID: number, course_courseID : number ) {
    //   // this.coursecompleted = coursecompleted;
    //   // this.student_studentID = student_studentID;
    //   this.course_courseID=course_courseID;
    // }
  }