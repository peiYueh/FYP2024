from bson.objectid import ObjectId

class Transaction:
    def __init__(self, db):
        self.collection = db['transaction']

    def insert_transaction(self, data):
        print("transaction model here")
        result = self.collection.insert_one(data)
        return result.inserted_id
    
    def update_transaction(self, transaction):
        print("in model")
        transaction_id = transaction['_id']
        transaction.pop('_id')
        result = self.collection.update_one({'_id': ObjectId(transaction_id)}, {'$set': transaction})

        if result.matched_count > 0:
            return {"message": "Transaction updated successfully"}, 200
        else:
            return {"error": "Transaction not found"}, 404
        
    def get_transaction(self, user_id):
        print("in model")
        return list(self.collection.find({'user_id': user_id}))  # Filter transactions by userId