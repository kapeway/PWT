Database Used: MongoDb

Databases Considered:MongoDb, SqlServer

Reason for selecting the database:
The nature of the app is relatively less write and more of database reads. We also know that the insurance data from different providers may not stick to same structure. Hence tying ourselves close in a relational database is not advisible. When it comes to scaling, No Sql databases are more easy to scale as well. 

Out of the 2 databases considered MongoDb is well suited for larger amount of data and is scalable as well.

How to run:
The app has 2 components an angular js based UI https://github.com/kapeway/PWT/tree/master/material-ui and Python flask based API https://github.com/kapeway/PWT/tree/master/python-flask-api

The UI can be started by running GULP task serve using the command "gulp serve"

The API can be started by running command "python pwtApi.py"

Login Page (Publicly available)
[![Login](https://github.com/kapeway/PWT/blob/master/screenshot/login.jpg)](#Login)

Premium Weekly
[![premium-weekly](https://github.com/kapeway/PWT/blob/master/screenshot/premium-weekly-view.jpg)](#premium-weekly)

Premium Monthly
[![premium-monthly](https://github.com/kapeway/PWT/blob/master/screenshot/premium-monthly-view.jpg)](#premium-monthly)

Policy Data
[![policy-data](https://github.com/kapeway/PWT/blob/master/screenshot/policy-data.jpg)](#policy-data)

Claim Data
[![claim-data](https://github.com/kapeway/PWT/blob/master/screenshot/claim-data.jpg)](#claim-data)

