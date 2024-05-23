from flask import g
from pymongo import MongoClient
from flask import current_app

def get_db():
    # Check if the database connection is already available
    print("HI")
    print(current_app.config)
    if 'db' not in g:
        # If not, create a new database connection
        client = MongoClient(current_app.config['MONGO_URI'])
        g.db = client[current_app.config['MONGO_DB_NAME']]
    
    return g.db