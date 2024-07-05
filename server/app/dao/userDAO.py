# from pymongo import MongoClient
import bcrypt
from bson.objectid import ObjectId

class User:
    def __init__(self, db):
        self.collection = db['user']
        self.basic_info_collection = db['basic_information']

    def create_user(self, username, email, password, birthDate, gender):
        print("in create user liao")
        if self.collection.find_one({'email': email}):
            return {'error': 'User already exists'}
        print("accessed collection")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = {
            'user_name': username,
            'user_email': email,
            'user_password': hashed_password,
            'user_birthDate': birthDate,
            'user_gender': gender
        }

        self.collection.insert_one(user)
        return {'message': 'User created successfully'}
    
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
        result = self.collection.update_one({'_id': ObjectId(user_id)}, {'$set': user})

        if result.matched_count > 0:
            return {"message": "Account updated successfully"}, 200
        else:
            return {"error": "Account not found"}, 404