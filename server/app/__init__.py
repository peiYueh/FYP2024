from flask import Flask, session
from flask_cors import CORS
from pymongo import MongoClient
from datetime import timedelta

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load configurations
    app.config.from_object('app.config.Config')
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
    app.config['SECRET_KEY'] = '1111'

    # Initialize MongoDB
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client[app.config['MONGO_DB_NAME']]
    
    # Register blueprints
    from app.routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/api')
    print("SERVER UP")

    return app