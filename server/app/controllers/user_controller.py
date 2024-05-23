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