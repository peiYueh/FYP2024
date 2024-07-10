from flask import request, jsonify, session
from app.dao.userDAO import User
import bcrypt
from bson import ObjectId

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

def getAccountDetails(db):
    user_id = "665094c0c1a89d9d19d13606"
    user_DAO = User(db)
    try:
        user = user_DAO.get_account_by_id(user_id)
        if user:
            print(user)
            user["_id"] = str(user["_id"])
            for key, value in user.items():
                if isinstance(value, bytes):
                    user[key] = value.decode('utf-8')  # Decode bytes to string
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def editAccount(db):
    print("Editing")
    data = request.get_json()
    print(data)
    userID = data.get('_id')

    if not userID:
        print("User ID not found")
        return jsonify({"error": "User ID is required"}), 400

    try:
        userID = ObjectId(userID)
    except Exception as e:
        return jsonify({"error": "Invalid User ID format"}), 400
    
    user_DAO = User(db)
    user_DAO.update_account(data)
    return jsonify({"message": "Data updated successfully"}), 201


def getInitialExpense(db):
    user_id = "665094c0c1a89d9d19d13606"
    # Fetch the user document from the database
    user_DAO = User(db)
    user_document = user_DAO.get_basic_information(user_id)
    # user_document = db.basic_info_collection.find_one({'_id': ObjectId(user_id)})
    if user_document:
        # Assuming the expenses are stored as a single integer under a key like 'expenses'
        return user_document.get('expenses', 0)
    return 0

def getInitialIncome(db):
    user_id = "665094c0c1a89d9d19d13606"
    # Fetch the user document from the database
    user_DAO = User(db)
    user_document = user_DAO.get_basic_information(user_id)
    if user_document:
        # Assuming the expenses are stored as a single integer under a key like 'expenses'
        return user_document.get('income', 0)
    return 0

def getLifeExpectancy(self, db):
    user_id = "665094c0c1a89d9d19d13606"
    # Fetch the user document from the database
    user_DAO = User(db)
    user_document = user_DAO.get_basic_information(user_id)
    if user_document:
        # Assuming the expenses are stored as a single integer under a key like 'expenses'
        return user_document.get('lifeExpectancy', 0)
    return 0

def getExpectedRetirement(self, db):
    user_id = "665094c0c1a89d9d19d13606"
    # Fetch the user document from the database
    user_DAO = User(db)
    user_document = user_DAO.get_basic_information(user_id)
    if user_document:
        # Assuming the expenses are stored as a single integer under a key like 'expenses'
        return user_document.get('retirementAge', 0)
    return 0

def getBasicInformation(db):
    user_id = "665094c0c1a89d9d19d13606"
    # Fetch the user document from the database
    user_DAO = User(db)
    user_document = user_DAO.get_basic_information(user_id)
    return user_document

from flask import jsonify
from datetime import datetime

def getUserAge(db):
    user_id = "665094c0c1a89d9d19d13606"
    user_DAO = User(db)
    try:
        user = user_DAO.get_account_by_id(user_id)
        if user:
            user["_id"] = str(user["_id"])
            for key, value in user.items():
                if isinstance(value, bytes):
                    user[key] = value.decode('utf-8')  # Decode bytes to string

            birth_date_str = user.get("user_birthDate")
            if birth_date_str:
                # Assuming birth_date_str is in the format "YYYY-MM-DD"
                birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
                today = datetime.today().date()
                age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                return age
            else:
                raise ValueError("User birth date not found")
        else:
            raise ValueError("User not found")
    except Exception as e:
        raise e