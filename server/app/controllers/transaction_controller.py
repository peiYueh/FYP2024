from flask import request, jsonify, session
from server.app.dao.transactionDAO import Transaction
from bson import ObjectId
from datetime import datetime, timedelta

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

    transaction_DAO = Transaction(db)
    inserted_id = transaction_DAO.insert_transaction(transaction)
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
    transaction_DAO = Transaction(db)
    transaction_DAO.update_transaction(transaction)
    return jsonify({"message": "Data updated successfully"}), 201

def getTransactions(db):
    # user_id = request.args.get('userId')  # Get the userId from query parameters
    user_id = "665094c0c1a89d9d19d13606"
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    transaction_DAO = Transaction(db)
    
    transactions = transaction_DAO.get_transaction(user_id)
    # Convert ObjectId to string
    for transaction in transactions:
        if '_id' in transaction:
            transaction['_id'] = str(transaction['_id'])

    print("Transaction hereeeeeeeeeeeeeeeeeeee")
    print(transactions)
    return jsonify(transactions)

def deleteTransaction(db, transaction_id):
    transaction_DAO = Transaction(db)
    
    # transactions = transaction_DAO.get_transaction(user_id)
    try:
        if transaction_DAO.delete_transaction(transaction_id):
            return jsonify({'message': 'Transaction deleted successfully'}), 200
        else:
            return jsonify({'message': 'Transaction not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
def categorizeTransactions(db):
    user_id = "665094c0c1a89d9d19d13606"  # Replace with dynamic user ID retrieval
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    transaction_DAO = Transaction(db)
    transactions = transaction_DAO.get_transaction(user_id)

    # Calculate the start and end date for the last month
    today = datetime.today()
    first_day_of_current_month = datetime(today.year, today.month, 1)
    last_day_of_last_month = first_day_of_current_month - timedelta(days=1)
    first_day_of_last_month = datetime(last_day_of_last_month.year, last_day_of_last_month.month, 1)

    categorized_data = {
        "passive_income": [],
        "active_income": [],
        "needs_expense": [],
        "wants_expense": [],
        "savings": []
    }
    
    for transaction in transactions:
        if '_id' in transaction:
            transaction['_id'] = str(transaction['_id'])
        
        transaction_date = datetime.strptime(transaction['transaction_date'], '%Y-%m-%d')  # Adjust date format as necessary

        # Filter transactions for the last month
        if first_day_of_last_month <= transaction_date <= last_day_of_last_month:
            transaction_type = transaction.get('transaction_type')
            category = transaction.get('transaction_category')

            needs_categories = {
                'Transportation', 'Household', 'Health', 'Food', 'Education',
                'Documents', 'Family', 'Liability', 'Utilities'
            }

            wants_categories = {
                'Apparel', 'Beauty', 'Tourism', 'Subscription', 'Social Life',
                'Money transfer', 'Investment', 'Grooming', 'Festivals', 'Culture'
            }

            if transaction_type == 1: 
                if transaction.get('income_type') == True:  # Adjust condition based on your schema
                    categorized_data["active_income"].append(transaction)
                else:
                    categorized_data["passive_income"].append(transaction)
            elif transaction_type == 0:  # Assuming '0' denotes expense
                if category in needs_categories:
                    categorized_data["needs_expense"].append(transaction)
                else:
                    categorized_data["wants_expense"].append(transaction)
            else:
                categorized_data["savings"].append(transaction)
    
    return jsonify(categorized_data), 200