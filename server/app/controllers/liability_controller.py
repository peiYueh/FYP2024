from flask import request, jsonify, session
from app.models.liability_model import Liability
from app.models.transaction_model import Transaction
from bson import ObjectId
from datetime import datetime, timezone

def newLiability(db):
    print("controller")
    data = request.json

    liability_name = data.get('name')
    total_amount = data.get('totalAmount')
    interest_rate = data.get('interestRate')
    term = data.get('term')
    monthly_payment = data.get('monthlyPayment')
    due_date = data.get('dueDate')
    lender_info = data.get('lenderInfo')
    purpose = data.get('purpose')
    userID = "665094c0c1a89d9d19d13606"

    liability = {
        'user_id' : userID,
        'liability_name': liability_name,
        'liability_amount': total_amount,
        'interest_rate': interest_rate,
        'term': term,
        'monthly_payment': monthly_payment,
        'due_date': due_date,
        'lender_info': lender_info,
        'purpose': purpose
    }

    liability_model = Liability(db)
    liability_id = liability_model.insert_liability(liability)

    return jsonify(str(liability_id))

def getLiabilities(db):
    user_id = "665094c0c1a89d9d19d13606"
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    liability_model = Liability(db)
    
    liabilities = liability_model.get_liabilities(user_id)
    # Convert ObjectId to string
    for liability in liabilities:
        if '_id' in liability:
            liability['_id'] = str(liability['_id'])

    print(liabilities)
    return jsonify(liabilities)

def getPaymentDates(db):
    liability_id = request.args.get('liability_id')
    print(liability_id)
    liability_model = Liability(db)
    payments = liability_model.get_liabilities_date(liability_id)

    for payment in payments:
        if '_id' in payment:
            payment['_id'] = str(payment['_id'])

    print(payment)
    return jsonify(payments)

def newPaymentUpdate(db):
    print("Editing")
    data = request.get_json()
    print(data)
    paymentUpdate = {
        'liability_id':data.get('liability_id'),
        'payment_date':data.get('payment_date'),
        'payment_amount':data.get('payment_amount'),
    }
    liability_model = Liability(db)
    # add to liability payment date
    inserted_id = liability_model.insert_payment_update(paymentUpdate)
    return jsonify(str(inserted_id))