//import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class Course {
    courseID: number; //saves as 1 or 0
    coursename:string;
    coursestartdate: string ; 
    courseenddate: string ; 

    constructor(courseID: number, coursename: string, coursestartdate : string,  courseenddate : string) {
      this.courseID = courseID;
      this.coursename = coursename;
      this.coursestartdate=coursestartdate;
      this.courseenddate=courseenddate;
    }
  }