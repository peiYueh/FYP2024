class Transaction:
    def __init__(self, db):
        self.collection = db['transaction']

    def insert_transaction(self, data):
        print("transaction model here")
        result = self.collection.insert_one(data)
        return result.inserted_id