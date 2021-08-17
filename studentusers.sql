SELECT * FROM studcertdb.studentusers;

INSERT INTO studcertdb.studentusers (student_studentID, firstname, lastname, username, password, active)
Values ('1', 'Mike', 'Smith' , 'Mike1' ,'123456', '1');

ALTER TABLE studcertdb.studentusers RENAME TO studcertdb.users;

