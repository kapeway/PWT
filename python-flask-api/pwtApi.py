# pwtApi.py
import os
import xlrd
import datetime
from flask import Flask, g, redirect, url_for, flash
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask_httpauth import HTTPBasicAuth
from flask_httpauth import HTTPTokenAuth
from werkzeug import secure_filename
from collections import OrderedDict
import simplejson as json
from flask_pymongo import PyMongo
from bson import json_util
from datetime import time


app = Flask(__name__)
CORS(app)
basicauth = HTTPBasicAuth()
tokenauth = HTTPTokenAuth('Bearer')

app.config['UPLOAD_FOLDER'] = '/home/kavinfranco/PWT/api/uploads'
app.config['ALLOWED_EXTENSIONS'] = set(['xlsx', 'xls'])
app.config['MONGO_DBNAME'] = 'pwtdb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/pwtdb'

mongo = PyMongo(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

users = {
    "testuser": "testuser"
}

tokens={
"asdasdasd":"testuser"
}

@basicauth.get_password
def get_pw(username):
    print 'UserName:'
    print username
    if username in users:
        return users.get(username)
    return None

@tokenauth.verify_token
def verify_token(token):
    print 'token verification'
    print token
    if token in tokens:
	g.current_user = tokens[token]
        return True
    return False
    
@app.route('/api/version', methods=['GET'])
@tokenauth.login_required
def get_version():
  return jsonify({'result' : 'v1'})

@app.route('/api/token', methods=['GET'])
@basicauth.login_required
def generatetoken():
  print 'in generate token controller'
  return jsonify({'token' : 'asdasdasd'})

@app.route('/api/upload', methods=['POST'])
@tokenauth.login_required
def upload():
        if 'file' not in request.files:
            flash('No file part')

        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            policy_work_book = xlrd.open_workbook(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            policy_data_sheet = policy_work_book.sheet_by_index(0)
            policydata = mongo.db.policydata
            for rownum in range(1, policy_data_sheet.nrows):
                policy = OrderedDict()
                row_values = policy_data_sheet.row_values(rownum)
                year, month, day, hour, minute, second = xlrd.xldate_as_tuple(row_values[0]+row_values[1],policy_work_book.datemode)
                policy['datetime'] = datetime.datetime(year, month, day, hour, minute, second)
                policy['policyType'] = row_values[2]
                policy['policyNumber'] = row_values[3]
                policy['policySubType'] = row_values[4]
                policy['policyHolderName'] = row_values[5]
                policy['insurerName'] = row_values[6]
                policy['sumInsured'] = row_values[7]
                policy['premium'] = row_values[8]
                policy['commisions'] = row_values[9]
                policy['ncb'] = row_values[10]
                policy['nominee'] = row_values[11]
                policy['dependents'] = row_values[12]
                policy['claimMade'] = row_values[13]
                policy['customerEmail'] = row_values[14]
                policydata.insert(policy)
            
            claim_data_sheet = policy_work_book.sheet_by_index(1)
            claimdata = mongo.db.claimdata

            for rownum in range(1, claim_data_sheet.nrows):
                claim = OrderedDict()
                row_values = claim_data_sheet.row_values(rownum)
                policy['sno'] = row_values[0]
                policy['policyNumber'] = row_values[1]
                year, month, day, hour, minute, second = xlrd.xldate_as_tuple(row_values[2],policy_work_book.datemode)
                claim['claimReportedDate'] = datetime.datetime(year, month, day, hour, minute, second)
                claim['claimStatus'] = row_values[3]
                claim['policyType'] = row_values[4]
                claim['policySubType'] = row_values[5]
                claim['claimedAmount'] = row_values[6]
                claimdata.insert(claim)
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    	    return jsonify({'isfileuploaded' : True})
        return jsonify({'isfileuploaded' : False})

if __name__ == '__main__':
    app.run(debug=True)
