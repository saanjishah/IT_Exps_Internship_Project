from PIL import Image, ImageDraw, ImageFont
import mysql.connector
import io, boto3
import json
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask import request,jsonify

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
    
    connection = mysql.connector.connect(host = 'localhost', database = 'studcertdb', username = 'root', password = 'root')

    print(firstName)
    print(lastName)
    print(studentID)
    print(courseName)
    print(endDate)
    print(courseComplete)

    courseName=courseName.replace(" ", "_")

    print("New Coursename: "+ courseName)


    s3 = boto3.resource('s3')
    client = boto3.client('s3')

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
    cursor = connection.cursor(buffered=True)
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
            print(0)
            im = Image.open(r'C:\Users\dimpl\Downloads\ITExpertInternship\PythonCertif\finalCertificate.jpg')
            d = ImageDraw.Draw(im)
            text_color = (0, 0, 0)
            font = ImageFont.truetype("constani.ttf", 36)
            W = 844

            fullName = str(firstName) + " " + str(lastName)
            w, h = d.textsize(fullName, font)
            location = ((W-w)/2, 227)
            d.text(location, fullName, fill = text_color, font = font)

            w, h = d.textsize(str(courseName), font)
            location = ((W-w)/2, 360)
            d.text(location, str(courseName), fill = text_color, font = font)

            w, h = d.textsize(str(endDate), font)
            location = ((W-w)/2, 475)
            d.text(location, str(endDate), fill = text_color, font = font)


            imagebuffer = io.BytesIO()
            im.save(imagebuffer,"PDF")
            imagebuffer.seek(0)
            key = folderName + "/" + fileName
            s3.Object('itexpertcertificate', key).put(Body=imagebuffer)
            obj = s3.ObjectAcl('itexpertcertificate', key)
            obj.put(ACL='public-read')

            url = f'https://itexpertcertificate.s3.amazonaws.com/{key}'

            sql_select_Query = "select courseID from studcertdb.course WHERE coursename=\"" + str(courseName) + "\""
            cursor.execute(sql_select_Query)
            courseID = cursor.fetchone()[0]
            

            sql_select_Query = "UPDATE studcertdb.certgeneratorlog SET CertificateURL=\"" + url + "\" WHERE course_courseID=\"" + str(courseID) + "\" AND student_studentID=\"" + str(studentID) + "\""
            cursor.execute(sql_select_Query)
            connection.commit()
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