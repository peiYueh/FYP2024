from pymongo import MongoClient
import bcrypt

class User:
    def __init__(self, db):
        self.collection = db['users']
        print("users collection")
        print(self.collection)

    def create_user(self, username, email, password, birthDate, gender):
        print("in create user liao")
        if self.collection.find_one({'email': email}):
            return {'error': 'User already exists'}
        print("accessed collection")
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'birthDate': birthDate,
            'gender': gender
        }

        self.collection.insert_one(user)
        return {'message': 'User created successfully'}