from flask import Flask, session
from flask_cors import CORS
from pymongo import MongoClient

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load configurations
    app.config.from_object('app.config.Config')

    # app.config['MAIL_SERVER'] = 'smtp.mail.apu.edu.my'  # Replace with your SMTP server address
    # app.config['MAIL_PORT'] = 587  # Replace with the appropriate port (e.g., 587 for TLS)
    # app.config['MAIL_USERNAME'] = 'tp061079@mail.apu.edu.my'
    # app.config['MAIL_PASSWORD'] = 'Yueh@061079'  # Replace with your email password or app-specific password
    # app.config['MAIL_USE_TLS'] = True  # Set to True or False based on provider’s requirements
    # app.config['MAIL_USE_SSL'] = False  # Set to True or False based on provider’s requirements




    app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Replace with your SMTP server
    app.config['MAIL_PORT'] = 587  # Use 465 for SSL or 587 for TLS
    app.config['MAIL_USERNAME'] = 'doit4duit.mobile@gmail.com'
    app.config['MAIL_PASSWORD'] = 'Duit@123'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['SECRET_KEY'] = '1111'

    # Initialize MongoDB
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client[app.config['MONGO_DB_NAME']]
    
    # Register blueprints
    from app.routes.user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/api')
    print("SERVER UP")

    return app