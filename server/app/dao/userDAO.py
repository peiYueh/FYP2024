# from pymongo import MongoClient
import bcrypt
from bson.objectid import ObjectId
import logging

class User:
    def __init__(self, db):
        self.collection = db['user']
        self.basic_info_collection = db['basic_information']

    def create_user(self, username, email, password, birthDate, gender):
        try:
            if self.collection.find_one({'user_email': email}):
                return {'error': 'User already exists'}
            
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            user = {
                'user_name': username,
                'user_email': email,
                'user_password': hashed_password,
                'user_birthDate': birthDate,
                'user_gender': gender
            }

            result = self.collection.insert_one(user)
            logging.info(f"User created with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            return {'error': 'Internal server error'}
    
    def get_user_by_email(self, email):
        return self.collection.find_one({'user_email': email})
    
    def insert_get_started_data(self, data):
        result = self.basic_info_collection.insert_one(data)
        return result.inserted_id
    
    def get_account_by_id(self, user_id):
        return self.collection.find_one({'_id': ObjectId(user_id)})

    def update_account(self, user):
        user_id = user['_id']
        user.pop('_id')
        print(user['user_email'])

        # Debugging: Print user_id and user_email
        print(f"Updating user with id: {user_id} and email: {user['user_email']}")

        # Ensure user_id is a valid ObjectId
        user_id_obj = ObjectId(user_id)

        # Check if the email already exists for a different user
        existing_user = self.collection.find_one({'user_email': user['user_email'], '_id': {'$ne': user_id_obj}})

        if existing_user:
            print(f"Existing user found: {existing_user}")
            return {'error': 'User with this email already exists'}
        
        # Update the user information
        result = self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': user})

        if result.matched_count > 0:
            return {"message": "Account updated successfully"}, 200
        else:
            return {"error": "Account not found"}, 404

        
    def get_basic_information(db, user_id):
        result = db.basic_info_collection.find_one({'user_id': user_id})
        if result and '_id' in result:
            result['_id'] = str(result['_id'])  # Convert ObjectId to string
        print(result)
        return result