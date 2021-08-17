export class CertGeneratorLog {
    GenerateDate: Date; //saves as 1 or 0
    CertificateURL:string;
    student_studentID: number ; 
    course_courseID: number ; 

       constructor(GenerateDate: Date, CertificateURL: string, student_studentID : number,  course_courseID : number) {

    // constructor(CertificateURL: string) {
      //this.GenerateDate = GenerateDate;
      this.CertificateURL = CertificateURL;
      //this.student_studentID=student_studentID;
      //this.course_courseID=course_courseID;
    }
  }