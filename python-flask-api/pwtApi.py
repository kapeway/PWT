# pwtApi.py
import os
import xlrd
import datetime
import aggregationHelper
from flask import Flask, g, redirect, url_for, flash
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask_httpauth import HTTPBasicAuth
from flask_httpauth import HTTPTokenAuth
from werkzeug import secure_filename
from collections import OrderedDict
import json
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
from bson.json_util import dumps
from bson.son import SON
from datetime import time
import pprint
from flask_mail import Mail
from flask_mail import Message

app = Flask(__name__)
mail = Mail(app)
CORS(app)
basicauth = HTTPBasicAuth()
tokenauth = HTTPTokenAuth('Bearer')
dir_path = os.path.dirname(os.path.realpath(__file__))
port = int(os.getenv("PORT"))

if 'VCAP_SERVICES' in os.environ:
    services = json.loads(os.getenv('VCAP_SERVICES'))
    mongodb_uri = services['mlab'][0]['credentials']['uri']
else:
    mongodb_uri = 'mongodb://localhost:27017/pwtdb'

app.config['UPLOAD_FOLDER'] = dir_path + '/uploads'
app.config['ALLOWED_EXTENSIONS'] = set(['xlsx', 'xls'])
app.config['MONGO_DBNAME'] = 'pwtdb'
app.config['MONGO_URI'] = mongodb_uri
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 25
app.config['MAIL_USERNAME'] = 'kapeway'
app.config['MAIL_PASSWORD'] = 'asdQWE123'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

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
                claim['sno'] = row_values[0]
                claim['policyNumber'] = row_values[1]
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

@app.route('/api/claims', methods=['GET'])
@tokenauth.login_required
def get_all_claims():
  claims = mongo.db.claimdata
  output = []
  for s in claims.find():
    output.append({'_id' : s['_id'], 'sno' : s['sno'],'policyNumber' : s['policyNumber'], 'claimReportedDate' : s['claimReportedDate'],'claimStatus' : s['claimStatus'], 'policyType' : s['policyType'],'policySubType' : s['policySubType'], 'claimedAmount' : s['claimedAmount']})
  return dumps({'result' : output})

@app.route('/api/claims/close/<int:sno>', methods=['PUT'])
@tokenauth.login_required
def close_claims(sno):
  Pipeline = aggregationHelper.get_policy_for_claim_no(sno)
  customeremailaggregationresult = list(mongo.db.claimdata.aggregate(Pipeline))
  customeremailcollection = customeremailaggregationresult[0]
  print customeremailcollection['customerEmail']
  customeremail = customeremailcollection['customerEmail']
  policynumber = customeremailcollection['policyNumber']
  msg = Message("Claim has been closed!",
                sender="kavin.franco@gmail.com",
                recipients=[customeremail,"kavinfranco19@gmail.com"]) 
                #recipients=["kavinfranco19@gmail.com"]) 
  msg.body ="Your claim on policy# "+policynumber+ " has been closed in PWT"
  mongo.db.claimdata.update_one({'sno':sno},{'$set':{'claimStatus':1}})
  mail.send(msg)
  return jsonify({'isClaimClosed' : True})

@app.route('/api/claims/reopen/<int:sno>', methods=['PUT'])
@tokenauth.login_required
def reopen_claims(sno):
  print sno
  try:
   mongo.db.claimdata.update_one({'sno':sno},{'$set':{'claimStatus':0}})
   return jsonify({'isClaimReopened' : True})
  except Exception, e:
   print str(e)

@app.route('/api/premiums/weekly', methods=['GET'])
@tokenauth.login_required
def get_weekly_premiums():
  Pipeline = aggregationHelper.get_weekly_premium()
  premium = list(mongo.db.policydata.aggregate(Pipeline))
  return dumps({'result' : premium})

@app.route('/api/premiums/monthly', methods=['GET'])
@tokenauth.login_required
def get_monthly_premiums():
  Pipeline = aggregationHelper.get_monthly_premium()
  premium = list(mongo.db.policydata.aggregate(Pipeline))
  return dumps({'result' : premium})

@app.route('/api/policy', methods=['GET'])
@tokenauth.login_required
def get_all_policy():
  policy = mongo.db.policydata
  output = []
  for s in policy.find():
    output.append({'_id' : s['_id'], 'datetime' : s['datetime'], 'datetimestring':s['datetime'].strftime("%Y-%m-%d %H:%M:%S"),'policyType' : s['policyType'],'policyNumber' : s['policyNumber'], 'policySubType' : s['policySubType'],'policyHolderName' : s['policyHolderName'], 'insurerName' : s['insurerName'],'sumInsured' : s['sumInsured'], 'premium' : s['premium'], 'commisions' : s['commisions'], 'ncb' : s['ncb'], 'nominee' : s['nominee'], 'dependents' : s['dependents'], 'claimMade' : s['claimMade'], 'customerEmail' : s['customerEmail']})
  return dumps({'result' : output})


if __name__ == '__main__':
    app.run(debug=True,threaded=True,host='0.0.0.0', port=port)
