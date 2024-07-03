from flask import request, jsonify, session
from app.dao.userDAO import User
import bcrypt

def signup(db):
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    birthDate = data.get('birthDate')
    gender = data.get('gender')

    print(username, email, password, birthDate, gender)

    # Perform server-side validation if needed
    if not username or not email or not password or not birthDate or not gender:
        return jsonify({'error': 'Missing required fields'}), 400

    user_DAO = User(db)
    result = user_DAO.create_user(username, email, password, birthDate, gender)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result), 201

def login(db):
    print("I'm in login user controller")
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    user_DAO = User(db)
    user = user_DAO.get_user_by_email(email)
    print(user)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['user_password']):
        user_id = user['_id']
        session['user_id'] = str(user_id)
        return jsonify({'message': 'Login successful!', 'user': {'email': user['user_email'], 'username': user['user_name']}}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401

def getStarted(db):
    data = request.get_json()

    user_DAO = User(db)
    inserted_id = user_DAO.insert_get_started_data(data['formData'])

    return jsonify({"message": "Data inserted successfully", "inserted_id": str(inserted_id)}), 201