from flask import Blueprint, current_app
from app.controllers.user_controller import signup

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/signup', methods=['POST'])
def signup_route():
    print("HIII")
    return signup(current_app.db)