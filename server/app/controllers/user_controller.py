from flask import request, jsonify, session
from app.models.user_model import User
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt

def signup(db):
    print("HIII Im in sign up")
    data = request.get_json()
    print(data)
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    birthDate = data.get('birthDate')
    gender = data.get('gender')

    print(username, email, password, birthDate, gender)

    # Perform server-side validation if needed
    if not username or not email or not password or not birthDate or not gender:
        return jsonify({'error': 'Missing required fields'}), 400

    user_model = User(db)
    result = user_model.create_user(username, email, password, birthDate, gender)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result), 201

def login(db):
    print("I'm in login user controller")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    user_model = User(db)
    user = user_model.get_user_by_email(email)
    print(user)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['user_password']):
        user_id = user['_id']
        session['user_id'] = str(user_id)
        return jsonify({'message': 'Login successful!', 'user': {'email': user['user_email'], 'username': user['user_name']}}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

def getStarted(db):
    data = request.get_json()

    user_model = User(db)
    inserted_id = user_model.insert_get_started_data(data['formData'])

    return jsonify({"message": "Data inserted successfully", "inserted_id": str(inserted_id)}), 201