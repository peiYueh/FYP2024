from flask import request, jsonify, session
from app.models.transaction_model import Transaction
from bson import ObjectId
from datetime import datetime, timezone

def newTransaction(db):
    print("Yes you are here")
    userID = "123123"

    data = request.get_json().get('transactionData')
    transactionType = data.get('transactionType')
    amount = data.get('amount')
    description = data.get('description')
    try:
        # Parse the date field to a datetime object with format dd/mm/yyyy
        transaction_date = datetime.strptime(data.get('date'), '%d/%m/%Y')
        # Convert the datetime object to UTC timezone
        # transaction_date = transaction_date.astimezone(tzinfo=timezone.utc)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid date format. Expected format: dd/mm/yyyy"}), 400

    category = data.get('category')
    incomeType = data.get('incomeType')
    incomeTaxability = data.get('incomeTaxability')
    savingInterestRate =data.get('savingInterestRate')
    # handle unrelated data
    if transactionType == 0:
        #expense
        incomeType = "-"
        incomeTaxability = "-"
        savingInterestRate = "-"
    elif transactionType == 1:
        category = "-"
        savingInterestRate = "-"
    elif transactionType == 2:
        category = "-"
        incomeType = "-"
        incomeTaxability = "-"
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