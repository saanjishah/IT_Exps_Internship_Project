SELECT * FROM studcertdb.certgeneratorlog;

INSERT INTO studcertdb.certgeneratorlog (GenerateDate, CertificateURL, student_studentID, course_courseID)
Values (current_timestamp(), 'CertificateURL', '1', "1");

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
flush privileges;

#TRUNCATE TABLE certgeneratorlog;


