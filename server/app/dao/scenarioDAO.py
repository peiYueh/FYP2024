from bson.objectid import ObjectId

class Scenario:
    def __init__(self, db):
        self.goal_collection = db['goal']

    def insert_goal(self, data):
        result = self.goal_collection.insert_one(data)
        return result.inserted_id

    def get_goal_by_id(self, goal_id):
        goal = self.goal_collection.find_one({"_id": ObjectId(goal_id)})
        return goal
    
    def update_goal(self, data):
        goal_id = data['_id']
        data.pop('_id')
        result = self.goal_collection.update_one({'_id': ObjectId(goal_id)}, {'$set': data})

        if result.matched_count > 0:
            return {"message": "Transaction updated successfully"}, 200
        else:
            return {"error": "Transaction not found"}, 404
        
    def get_all_goals(self, user_id):
        return list(self.goal_collection.find({'user_id': user_id}))
        
    def delete_goal(self, goal_id):
        try:
            obj_id = ObjectId(goal_id)
            result = self.goal_collection.delete_one({'_id': obj_id})
            if result.deleted_count > 0:
                print(f"Goal with ID {goal_id} deleted successfully.")
                return True
            else:
                print(f"Goal with ID {goal_id} not found or could not be deleted.")
                return False
        except Exception as e:
            print(f"Error deleting goal with ID {goal_id}: {e}")
            return False