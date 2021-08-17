import mysql.connector
import io, boto3
import json
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask import request,jsonify
import reportlab
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter,ELEVENSEVENTEEN
from reportlab.lib.pagesizes import landscape
from reportlab.platypus import Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

app = Flask(__name__)
api = Api(app)

CORS(app)

@app.route("/students")
def name():
    firstName = request.args.get('fname')
    lastName = request.args.get('lname')
    studentID  = request.args.get('studentID')
    courseName = request.args.get('coursename')
    endDate = request.args.get('enddate')
    courseComplete = request.args.get('ccomplete')

    if courseComplete == "True":
        ccomplete = True
    else:
        ccomplete = False
    
    #connection = mysql.connector.connect(host = 'localhost', database = 'school', username = 'root', password = 'Squable98*')

    print(firstName)
    print(lastName)
    print(studentID)
    print(courseName)
    print(endDate)
    print(courseComplete)

    courseName=courseName.replace(" ", "_")

    print("New Coursename: "+ courseName)

    session = boto3.Session(
        aws_access_key_id= "AKIAJHFDXFIFB43YWRHA",
        aws_secret_access_key= "D8eQ2Cnqfv1LzD85UgMO1SM4+udDkfTTLIRvR9Zs",
    )


    s3 = session.resource('s3')
    client = session.client('s3')

    var = s3.Bucket('itexpertcertificate') in s3.buckets.all()
    if not var:
        s3.create_bucket(Bucket = 'itexpertcertificate', CreateBucketConfiguration={'LocationConstraint': 'us-east-2'})

    bucket_policy = {
    "Version": "2012-10-17",
    "Id": "S3PolicyId1",
    "Statement": [
        {
        "Sid": "IPAllow",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:*",
        "Resource": "arn:aws:s3:::itexpertcertificate/*",
        "Condition": {
            "IpAddress": {
            "aws:SourceIp": [
                "169.254.1.112/16",
                "10.0.0.142"
            ]
            }
        }
        }
    ]
    }
    bucket_policy = json.dumps(bucket_policy)
    client.put_bucket_policy(Bucket="itexpertcertificate", Policy=bucket_policy)

    #where dummy parameters were originally

    #sql_select_Query = "select student_studentID from studcertdb.studentusers WHERE username=\"" + userName + "\""
    #cursor = connection.cursor()
    #cursor.execute(sql_select_Query)
    #cursor = connection.cursor(buffered=True)
    #studentID = cursor.fetchone()[0]

    bucket = s3.Bucket('itexpertcertificate')
    folderName = str(firstName) + "_" + str(lastName) + "_" + str(studentID)
    folder = list(bucket.objects.filter(Prefix= folderName))
    if len(folder) == 0:
        client.put_object(Bucket = "itexpertcertificate", Key = folderName)

    fileName = str(firstName) + "_" + str(lastName) + "_" + str(studentID) + "_" + str(courseName) + ".pdf"
    folder = list(bucket.objects.filter(Prefix= folderName + "/" + fileName))

    courseName=courseName.replace("_"," ")
    print("Changed cName: "+ courseName)

    if len(folder) == 0:
        madeYet = False
    else:
        madeYet = True
        
    if madeYet == False:
        if ccomplete == True:
            pdfmetrics.registerFont(TTFont('constani', 'constani.ttf'))
            c = canvas.Canvas(fileName, pagesize=landscape(ELEVENSEVENTEEN))
            
            filename = 'finalCertificate.jpg'
            c.drawImage(filename, 0, 10, width=None, height=None)
            
            c.setFont("constani", 36 , leading=None)
            fullName = firstName + " " + lastName
            c.drawCentredString(420, 450, fullName)
           
            c.setFont("constani", 36, leading=None)
            c.drawCentredString(425, 320, courseName)
            
            c.setFont("constani", 36, leading=None)
            c.drawCentredString(420, 200, endDate)
            c.showPage()

            imagebuffer = io.BytesIO()
            c._doc.SaveToFile(imagebuffer, "PDF")
            imagebuffer.seek(0)
            key = folderName + "/" + fileName
            s3.Object('itexpertcertificate', key).put(Body=imagebuffer)
            obj = s3.ObjectAcl('itexpertcertificate', key)
            obj.put(ACL='public-read')

            url = f'https://itexpertcertificate.s3.amazonaws.com/{key}'

            #sql_select_Query = "select courseID from school.course WHERE coursname=\"" + str(courseName) + "\""
            #cursor.execute(sql_select_Query)
            #courseID = cursor.fetchone()[0]
            

            #sql_select_Query = "UPDATE school.certgeneratorlog SET CertificateURL=\"" + url + "\" WHERE course_courseID=\"" + str(courseID) + "\" AND student_studentID=\"" + str(studentID) + "\""
            #cursor.execute(sql_select_Query)
            #connection.commit()
            return jsonify(url)
        else:
            message = f'Certificate could not be produced because student has not yet completed the course'
            print(1)
            return jsonify(message)
    else: 
        message = f'exists'
        return jsonify(message)
if __name__ == '__main__':
    app.run(port=5002)