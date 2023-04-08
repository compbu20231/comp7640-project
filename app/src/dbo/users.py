from flask import jsonify, request
from flask_restful import Resource
from dbo.dbconnect import *

# Define a cursor object to interact with the database
cursor = db.cursor()

class User(Resource):
    def get(self, user_id=None):
        if user_id:
            cursor.execute("SELECT * FROM users WHERE id= " + str(user_id))
            user = cursor.fetchone()
            return jsonify({
                "id": user[0],
                "name": user[1],
                "email": user[2]
            })
        else:
            cursor.execute("SELECT * FROM users")
            result = cursor.fetchall()
            users = []
            for user in result:
                users.append({
                    "id": user[0],
                    "name": user[1],
                    "email": user[2]
                })
            return jsonify(users)

    def post(self):
        data = request.get_json()
        name = data["name"]
        email = data["email"]
        cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", (name, email))
        db.commit()
        return jsonify({"message": "User added successfully"})

    def put(self, user_id):
        data = request.get_json()
        name = data["name"]
        email = data["email"]
        cursor.execute("UPDATE users SET name=%s, email=%s WHERE id=%s", (name, email, user_id))
        db.commit()
        return jsonify({"message": "User updated successfully"})

    def delete(self, user_id):
        cursor.execute("DELETE FROM users WHERE id=%s", (user_id,))
        db.commit()
        return jsonify({"message": "User deleted successfully"})
