from flask import request, jsonify
from app.models.user_model import User

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
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful!', 'user': {'email': user.email, 'username': user.username}}), 200
    else:
        return jsonify({'message': 'Invalid email or password'}), 401
