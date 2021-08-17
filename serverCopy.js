var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');
const mysql = require('mysql')

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'
// create database school;

// use school;

// CREATE TABLE school.student (
//     id int NOT NULL AUTO_INCREMENT,
//     firstName varchar(255) NOT NULL,
//     lastName varchar(255),
//     PRIMARY KEY (id)
// );


const options = {
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'studcertdb'

}

const connection = mysql.createConnection(options)

connection.connect(function(err) {
   if (err) throw err;
   console.log("Connected!");
 });

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(function(req, res, next) {
   res.header("content-type", "application/json");
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
  next();
});

//////////////////////////////////// Student DB /////////////////////////


app.get('/students', function (req, res) {   
   connection.query("SELECT * FROM  `studcertdb`.`student` ", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.post('/students', function (req, res) {   
   var studentID = req.body.studentID;
   var firstname = req.body.firstname;
   var lastname = req.body.lastname;
   var email = req.body.email;

   console.log ("post");
   console.log(req.body);

   connection.query("INSERT INTO `studcertdb`.`student` (`firstname`, `lastname`, `email`) VALUES ('"+firstname+"', '"+lastname+"',  '"+email+"'); ", function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.delete('/students/:studentID', function (req, res) {
   connection.query("DELETE FROM  `studcertdb`.`student`  WHERE studentID = " + req.params.studentID, function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})

app.put('/students/:studentID', function (req, res) {
   console.log ("put");
   console.log(req.body);
 
    connection.query("UPDATE  `studcertdb`.`student` set firstname = '"+req.body.firstname+ "' , lastname ='" +req.body.lastname + "', email ='" +req.body.email+"' where studentID = " + req.params.studentID, function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

app.get('/students/:studentID', function (req, res) {
   console.log("student ID: "+ req.params.studentID);
   connection.query("SELECT * FROM `studcertdb`.`student` where studentID = " + req.params.studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})


// app.get('/addUser/students/:studentEmail', function (req, res) {
//    console.log("student ID: "+ req.params.studentID);
//    connection.query("SELECT studentID FROM `studcertdb`.`student` where email = " + req.params.studentEmail, function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//       res.end(JSON.stringify(result));
//     });
// })


// app.put('/students/:studentId', function (req, res) {
//   console.log ("put");
//   console.log(req.body);

//    connection.query("UPDATE  `school`.`student` set firstname = '"+req.body.firstName+ "' , lastname ='" +req.body.lastName + "' where id = " + req.params.studentId, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })

// app.delete('/students/:studentId', function (req, res) {
//    connection.query("DELETE FROM  `school`.`student`  WHERE id = " + req.params.studentId, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })


// app.post('/addStudent', function (req, res) {
//    // First read existing users.
//    res.end( JSON.stringify(req.body));
// })

//////////////////////////////////// Entrollment DB /////////////////////////

app.get('/enrollment', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`enrollment` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

 app.get('/enrollment/:studentID', function (req, res) {  
   console.log(req.params.studentID);
   connection.query("SELECT course_courseID FROM  `studcertdb`.`enrollment` where student_studentID = " + req.params.studentID, function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
      
    });
})

app.get('/enrollment/course/:courseID', function (req, res) {  
    console.log("Course ID: "+req.params.course_courseID);
   connection.query("SELECT coursecompleted FROM  `studcertdb`.`enrollment` where course_courseID = " + req.params.courseID, function (err, result, fields) {
      console.log(req.params.courseID);
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
      
    });
})

// app.get('/enrollment/addCourse/:studentID', function (req, res) {  
//    //console.log("Course ID: "+req.params.course_courseID);
//   connection.query("SELECT course_courseID FROM  `studcertdb`.`enrollment` where student_studentID= " + req.params.studentID, function (err, result, fields) {
//      console.log(req.params.courseID);
//      if (err) throw err;
//      console.log(result);
//      res.end(JSON.stringify(result));
     
//    });
// })


app.delete('/enrollment/:student_studentID/:course_courseID', function (req, res) {
   console.log("Course ID: "+req.params.course_courseID);
   console.log("studentID: "+ req.params.student_studentID);
   connection.query("DELETE FROM  `studcertdb`.`enrollment`  WHERE course_courseID = " + 
   req.params.course_courseID + " AND student_studentID= "+ req.params.student_studentID, 
   function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
      console.log(result);
    });
})


// app.get('/coursecomplete/:courseID', function (req, res) {
//    connection.query("SELECT coursecompleted FROM `studcertdb`.`enrollment` where course_courseID = " + req.params.courseID, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })

 
 
 app.post('/enrollment', function (req, res) {   
    var coursecompleted = req.body.coursecompleted;
    var student_studentID = req.body.student_studentID;
    var course_courseID = req.body.course_courseID;
 
    console.log ("post");
    console.log(req.body);
 
    connection.query("INSERT INTO `studcertdb`.`enrollment` (`coursecompleted`, `student_studentID`, `course_courseID`) VALUES ('"+coursecompleted+"', '"+student_studentID+"',  '"+course_courseID+"'); ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })



//////////////////////////////////// Course DB /////////////////////////

app.get('/course', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`course` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })



 app.post('/course', function (req, res) {   
    var courseID = req.body.courseID;
    var coursename = req.body.coursename;
    var coursestartdate = req.body.coursestartdate;
    var courseenddate = req.body.courseenddate;

 
    console.log ("post");
    console.log(req.body);
 
    connection.query("INSERT INTO `studcertdb`.`course` (`courseID`, `coursename`, `coursestartdate` , `courseenddate`) VALUES ('"+courseID+"', '"+coursename+"',  '"+coursestartdate+"',  '"+courseenddate+"'); ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

 
app.get('/course/:courseID', function (req, res) {
   //console.log("get course of course ID: "+ req.params.courseID);
   connection.query("SELECT * FROM `studcertdb`.`course` where courseID = " + req.params.courseID, function (err, result, fields) {
      console.log(req.params.courseID);
      console.log(result);
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})

// app.get('/coursename/:courseID', function (req, res) {
//    console.log("coursename server.js courseID: "+ req.params.courseID);
//    connection.query("SELECT coursename FROM `studcertdb`.`course` where courseID = " + req.params.courseID, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })

app.get('/courseenddate/:courseID', function (req, res) {
   connection.query("SELECT courseenddate FROM `studcertdb`.`course` where courseID = " + req.params.courseID, function (err, result, fields) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})


app.delete('/course/:courseID', function (req, res) {
   connection.query("DELETE FROM  `studcertdb`.`course` WHERE courseID = " + req.params.courseID, function (err, result, fields) { //added studentID
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
})

// app.put('/students/:courseID', function (req, res) {
//    console.log ("put");
//    console.log(req.body);
 
//     connection.query("UPDATE  `studcertdb`.`course` set firstname = '"+req.body.firstname+ "' , lastname ='" +req.body.lastname + "' where studentID = " + req.params.studentID, function (err, result, fields) {
//        if (err) throw err;
//        res.end(JSON.stringify(result));
//      });
//  })

 /////////// To get all students in sepecific class only
//  app.get('/course/:courseID', function (req, res) {
//    connection.query("SELECT * FROM `studcertdb`.`course` where id = " + req.params.courseID, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })
///////////////////////////////////////////////////////// 


//////////////////////////////////// Certgeneratorlog DB /////////////////////////

app.get('/certgeneratorlog', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`certgeneratorlog` ", function (err, result, fields) {
       if (err) throw err;
       res.end(JSON.stringify(result));
     });
 })

 //app.get('/certificate/certgeneratorlog/:student_studentID:break:course_courseID', function (req, res) {   //:student_studentID:break:course_courseID
   
   app.get('/certificate/certgeneratorlog/:student_studentID?:course_courseID', function (req, res) {   //:student_studentID:break:course_courseID



   //req.query = JSON.parse(req.query);
   // var courseURL= JSON.parse(req.query['JSON']);
   // var student_studentID= courseURL[0];
   // var course_courseID= courseURL[1];

   // console.log(student_studentID);
   // console.log(course_courseID);

   //var course_courseID  = JSON.parse(req.query['courseURL']);


 //  req.query.student_studentID;
  // var course_courseID = req.query.course_courseID;

    //console.log(req.query.student_studentID)
    //console.log(req.query.course_courseID)

   //console.log(student_studentID);
   //console.log(course_courseID);
   console.log("certIdcourse:"+ req.params.course_courseID);
   console.log("certIDstudent"+ req.params.student_studentID);
   //console.log("Break; "+ req.params.break);

   //connection.query("SELECT CertificateURL FROM `studcertdb`.`certgeneratorlog`  WHERE student_studentID = " +  req.params.student_studentID + " AND course_courseID= "+req.params.course_courseID, function (err, result, fields) { //added studentID

   connection.query("SELECT CertificateURL FROM `studcertdb`.`certgeneratorlog`  WHERE course_courseID = " +  req.params.course_courseID + " AND student_studentID= "+req.params.student_studentID, function (err, result, fields) { //added studentID

  //  connection.query("SELECT CertificateURL FROM `studcertdb`.`certgeneratorlog`  WHERE course_courseID = " + course_courseID + " AND student_studentID= "+ student_studentID, function (err, result, fields) { //added studentID

  //connection.query("SELECT CertificateURL FROM  `studcertdb`.`certgeneratorlog` WHERE student_studentID = "+ req.params.student_studentID, function (err, result, fields) {
      if (err) throw err;
      console.log( req.params.course_courseID);
      console.log( req.params.student_studentID);
      console.log(result);
      res.end(JSON.stringify(result));
    });
})

app.get('/certificate/certgeneratorlog/:student_studentID', function (req, res) {   
   connection.query("SELECT CertificateURL FROM  `studcertdb`.`certgeneratorlog` WHERE student_studentID = "+ req.params.student_studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})

app.get('/certgeneratorlog/studentInfo/:student_studentID', function (req, res) {   
   connection.query("SELECT * FROM  `studcertdb`.`certgeneratorlog` WHERE student_studentID = "+ req.params.student_studentID, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})

 
 
 app.post('/certgeneratorlog', function (req, res) {  
    //var GenerateDate = req.body.GenerateDate; 
    var CertificateURL = req.body.CertificateURL;
    var student_studentID = req.body.student_studentID;
    var course_courseID = req.body.course_courseID;
 
    console.log ("post");
    console.log(req.body);
 //     connection.query("INSERT INTO `studcertdb`.`certgeneratorlog` (`GenerateDate`,`CertificateURL`, `student_studentID`, `course_courseID`) VALUES ('"+GenerateDate+"','"+CertificateURL+"', '"+student_studentID+"',  '"+course_courseID+"'); ", function (err, result, fields) {

    connection.query("INSERT INTO `studcertdb`.`certgeneratorlog` (`CertificateURL`, `student_studentID`, `course_courseID`) VALUES ('"+CertificateURL+"', '"+student_studentID+"',  '"+course_courseID+"'); ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })
//////////////////////////////////// Studentusers DB /////////////////////////

app.get('/userinfo', function (req, res) {   
    connection.query("SELECT * FROM  `studcertdb`.`users` ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })
 
 app.get('/admin/username', function (req, res) {   
   connection.query("SELECT username FROM  `studcertdb`.`users` ", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    });
})
 
 app.post('/users', function (req, res) {   
    var ID = req.body.ID;
    //var firstname = req.body.firstname;
    //var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    //var active = req.body.active;

 
    console.log ("post users");
    console.log(req.body);
 // (`student_studentID`,`firstname`, `lastname`, `username`,`password`, `active`) VALUES ('"+firstname+"', '"+lastname+"',  '"+username+"', '"+password+"', '"+active+"'); ", function (err, result, fields) {
    connection.query("INSERT INTO `studcertdb`.`users` (`ID`, `username`, `password`) VALUES ('"+ID+"', '"+username+"', '"+password+"'); ", function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })

 app.put('/users/:username:password', function (req, res) {
   console.log ("put users");
   console.log(req.params.password);
 
    connection.query("UPDATE `studcertdb`.`users` set password=" + req.params.password + " WHERE username = " + req.params.username, function (err, result, fields) {
       if (err) throw err;
       console.log(result);
       res.end(JSON.stringify(result));
     });
 })

//  app.get('/users/:username', function (req, res) {   
//     console.log("get users");
//    connection.query("SELECT * FROM  `studcertdb`.`users` WHERE username = " + req.params.username, function (err, result, fields) {
//       if (err) throw err;
//       res.end(JSON.stringify(result));
//     });
// })



//  app.delete('/users/:studentID', function (req, res) {
//    console.log("id deleting: "+ req.params.studentID);
//    connection.query("DELETE FROM  `studcertdb`.`users` WHERE ID = " + req.params.studentID, function (err, result, fields) { 
//       if (err) throw err;
//       console.log("deleted student from users table");
//       console.log(result);
//       res.end(JSON.stringify(result));
//     });
// })

//////////////////////////////////// Adminusers DB /////////////////////////

// app.get('/adminusers', function (req, res) {   
//     connection.query("SELECT * FROM  `studcertdb`.`adminusers` ", function (err, result, fields) {
//        if (err) throw err;
//        res.end(JSON.stringify(result));
//      });
//  })
 
 
//  app.post('/adminusers', function (req, res) {   
//     var firstname = req.body.firstname;
//     var lastname = req.body.lastname;
//     var username = req.body.username;
//     var password = req.body.password;
 
//     console.log ("post");
//     console.log(req.body);
//     connection.query("INSERT INTO `studcertdb`.`adminusers` (`firstname`, `lastname`, `username`, `password`) VALUES ('"+firstname+"',  '"+lastname+"', '"+username+"', '"+password+"'); ", function (err, result, fields) {
//        if (err) throw err;
//        res.end(JSON.stringify(result));
//      });
//  })






var server = app.listen(9000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})