
from flask import Flask
from flask_cors import CORS
from flask import Blueprint, current_app, request
from app.controllers.user_controller import signup, login
from app.db import get_db
from app import create_app

app = create_app()
CORS(app)
app.secret_key = 'your_secret_key_here'

# members API route
@app.route("/members")
def members():
    return {"my words": ["This", "Is", "My", "words"]}

@app.route('/signup', methods=['POST'])
def signup_route():
    db = get_db()  # Get the database connection
    data = request.json  # Access JSON data from request body
    return signup(db)


@app.route('/login', methods=['POST'])
def login_route():
    db = get_db()  # Get the database connection
    data = request.json  # Access JSON data from request body
    return login(db)

if __name__ == "__main__":
    app.run(debug=True)