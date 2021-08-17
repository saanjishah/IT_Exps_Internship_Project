//import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class Course2 {
    courseID: number; //saves as 1 or 0
    coursename:string;
    coursestartdate: string ; 
    courseenddate: string ;
    hasCertGen: boolean; 

    constructor(courseID: number, coursename: string, coursestartdate : string,  courseenddate : string, hasCertGen: boolean) {
      this.courseID = courseID;
      this.coursename = coursename;
      this.coursestartdate=coursestartdate;
      this.courseenddate=courseenddate;
      this.hasCertGen=hasCertGen;
    }
  }