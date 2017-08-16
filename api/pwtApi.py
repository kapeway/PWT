# pwtApi.py
import os
from flask import Flask, g, redirect, url_for, flash
from flask_cors import CORS, cross_origin
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo
from flask_httpauth import HTTPBasicAuth
from flask_httpauth import HTTPTokenAuth
from werkzeug import secure_filename

app = Flask(__name__)
CORS(app)
basicauth = HTTPBasicAuth()
tokenauth = HTTPTokenAuth('Bearer')

app.config['UPLOAD_FOLDER'] = '/home/kavinfranco/pwt/api/uploads'
app.config['ALLOWED_EXTENSIONS'] = set(['xlsx', 'xls'])

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
    

app.config['MONGO_DBNAME'] = 'pwtdb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/pwtdb'

mongo = PyMongo(app)

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
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')

        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
	    return jsonify({'isfileuploaded' : True})
        return jsonify({'isfileuploaded' : False})

if __name__ == '__main__':
    app.run(debug=True)
