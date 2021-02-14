from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.json_util import dumps
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)
from geopy.geocoders import Nominatim
import datetime

app = Flask(__name__)

app.config['JWT_TOKEN_LOCATION'] = ['cookies']
# app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
# app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret'

jwt = JWTManager(app)

client = MongoClient("mongodb+srv://admin:hackoverflow@ourcluster.ag8u2.mongodb.net/Users?retryWrites=true&w=majority")
db = client['Users']

# Error Handler function
@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'User Not Found'
    }

    response = jsonify(message)
    response.status_code = 404

    return response


# Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    address = data['address']
    # lat = 
    # long = 
    contact_no = data['contact_no']
    pwd = data['password']
    password = generate_password_hash(pwd) 

    # type 0 -> Admin, 1 -> Employee
    if data['type']:
        user_type = 1
    else:
        user_type = 0

    geolocator = Nominatim(user_agent='Timely')
    location = geolocator.geocode(address) 
    id = db.user.insert({
        'username':username,
        'password': password,
        'address': address,
        'lat': location.latitude,
        'long': location.longitude,
        'contact_no':contact_no,
        'type': user_type})

    response = jsonify("User's data added successfully!")
    response.status_code = 200

    return response

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    username = data['username']
    pwd = data['password']

    user = db.user.find_one({'username': username})
    if check_password_hash(user['password'], pwd):
    # if user['password'] == pwd:
        # Create the tokens we will be sending back to the user
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        str_id = str(user['_id'])

        response = jsonify({
            'message': "User successfully logged in!",
            'user_type': user["type"],
            'access token': access_token,
            'id': str_id
            })
        response.status_code = 200
        
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)

        return response
    else:
        return not_found()

# Logout
@app.route('/token/remove', methods=['POST'])
@jwt_required
def logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200

@app.route('/get_all_users_data', methods = ['GET'])
# @jwt_required
def get_all_users_data():
    users = db.user.find()
    # print(users)
    response = dumps(users) 
    return response

@app.route('/get_user_data/<id>')
# @jwt_required
def get_user_data(id):
    user = db.user.find_one({'_id':ObjectId(id)})
    response = dumps(user)
    return response


@app.route('/store_user_data', methods=['POST'])
# @jwt_required
def store_user_data():
    data = request.json
    id = db.user.insert(data)

    response = jsonify("User's data added successfully!")
    response.status_code = 200

    return response


@app.route('/get_user_activity_data/<id>')
# @jwt_required
def get_user_activity_data(id):
    activities = db.user_activities.find({'user_id':ObjectId(id)})
    response = dumps(activities)
    return response


@app.route('/store_user_activity_data/<id>', methods=['POST'])
# @jwt_required
def store_user_activity_data(id):
    data = request.json

    date = datetime.datetime.now().strftime("%x")
    time = datetime.datetime.now().strftime("%X")
    id = db.user_activities.insert({
        'user_id':ObjectId(id),
        'date': date,
        'time': time,
        'activities': data['activities'],
        })

    response = jsonify("User's activity data added successfully!")
    response.status_code = 200

    return response


@app.route('/get_user_attendance_data/<id>')
# @jwt_required
def get_user_attendance_data(id):
    attendance = db.user_attendance.find({'user_id':ObjectId(id)})
    response = dumps(attendance)
    return response


@app.route('/store_user_attendance_data/<attendance>/<id>', methods=['POST'])
# @jwt_required
def store_user_attendance_data(id, attendance):
    data = request.json

    date = datetime.datetime.now().strftime("%x")
    time = datetime.datetime.now().strftime("%X")
    id = db.user_attendance.insert({
        'user_id':ObjectId(id),
        'date': date,
        'time': time,
        'attendance': attendance,
        })

    response = jsonify("User's attendance has been marked successfully!")
    response.status_code = 200

    return response

if __name__ == '__main__':
    app.run(debug = True, port = 8080)