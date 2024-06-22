from flask import request, jsonify, session
from app.models.transaction_model import Transaction
from bson import ObjectId
from datetime import datetime, timezone

def newTransaction(db):
    print("Yes you are here")
    userID = "665094c0c1a89d9d19d13606"

    data = request.get_json().get('transactionData')
    transactionType = data.get('transaction_type')
    amount = data.get('transaction_amount')
    description = data.get('transaction_description')
    category = data.get('transaction_category')
    incomeType = data.get('income_type')
    incomeTaxability = data.get('income_taxability')
    savingInterestRate =data.get('interest_rate')
    transaction_date = data.get('transaction_date')
    # handle unrelated data
    if transactionType == 0:
        incomeType = False
        incomeTaxability = False
        savingInterestRate = 0
        amount = 0 - amount
    elif transactionType == 1:
        category = "-"
        savingInterestRate = 0
    elif transactionType == 2:
        category = "-"
        incomeType = False
        incomeTaxability = False
    transaction = {
        'user_id': userID,
        'transaction_type': transactionType,
        'transaction_amount': amount,
        'transaction_description': description,
        'transaction_date': transaction_date,
        'transaction_category': category,
        'income_type': incomeType,
        'income_taxability': incomeTaxability,
        'interest_rate': savingInterestRate
    }

    transaction_model = Transaction(db)
    inserted_id = transaction_model.insert_transaction(transaction)
    return jsonify({"message": "Data inserted successfully", "inserted_id": str(inserted_id)}), 201

def editTransaction(db):
    print("Editing")
    data = request.get_json()
    print(data)
    userID = "665094c0c1a89d9d19d13606"
    transaction_id = data.get('transaction_id')

    if not transaction_id:
        print("Trans ID not found")
        return jsonify({"error": "Transaction ID is required"}), 400

    # Convert the transaction_id to an ObjectId
    try:
        transaction_id = ObjectId(transaction_id)
    except Exception as e:
        return jsonify({"error": "Invalid Transaction ID format"}), 400
    transactionType = data.get('transaction_type')
    amount = data.get('transaction_amount')
    description = data.get('transaction_description')
    category = data.get('transaction_category')
    incomeType = data.get('income_type')
    incomeTaxability = data.get('income_taxability')
    savingInterestRate =data.get('interest_rate')
    transaction_date = data.get('transaction_date')
    # handle unrelated data
    if transactionType == 0:
        #expense
        incomeType = False
        incomeTaxability = False
        savingInterestRate = 0
        amount = 0 - amount
    elif transactionType == 1:
        category = "-"
        savingInterestRate = 0
    elif transactionType == 2:
        category = "-"
        incomeType = False
        incomeTaxability = False
    transaction = {
        '_id': transaction_id,
        'user_id': userID,
        'transaction_type': transactionType,
        'transaction_amount': amount,
        'transaction_description': description,
        'transaction_date': transaction_date,
        'transaction_category': category,
        'income_type': incomeType,
        'income_taxability': incomeTaxability,
        'interest_rate': savingInterestRate
    }
    print("GOing to model")
    transaction_model = Transaction(db)
    transaction_model.update_transaction(transaction)
    return jsonify({"message": "Data updated successfully"}), 201

def getTransactions(db):
    # user_id = request.args.get('userId')  # Get the userId from query parameters
    user_id = "665094c0c1a89d9d19d13606"
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    transaction_model = Transaction(db)
    
    transactions = transaction_model.get_transaction(user_id)
    # Convert ObjectId to string
    for transaction in transactions:
        if '_id' in transaction:
            transaction['_id'] = str(transaction['_id'])

    print("Transaction hereeeeeeeeeeeeeeeeeeee")
    print(transactions)
    return jsonify(transactions)

def deleteTransaction(db, transaction_id):
    transaction_model = Transaction(db)
    
    # transactions = transaction_model.get_transaction(user_id)
    try:
        if transaction_model.delete_transaction(transaction_id):
            return jsonify({'message': 'Transaction deleted successfully'}), 200
        else:
            return jsonify({'message': 'Transaction not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
