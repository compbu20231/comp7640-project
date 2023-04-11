from flask import jsonify, request
from flask_restful import Resource
from dbo.dbconnect import *

# Define a cursor object to interact with the database
cursor = db.cursor()

class Shop(Resource):
    def get(self, shop_id=None):
        sql = ''
        if shop_id:
            sql = "SELECT * FROM shops WHERE shop_id= " + str(shop_id)
        else:
            sql = "SELECT * FROM shops order by shop_id desc"  
        cursor.execute(sql)
        result = cursor.fetchall()
        shops = []
        for shop in result:
            shops.append({
                "shop_id": shop[0],
                "sname": shop[1],
                "rating": shop[2],
                "location": shop[3]
            })
        return jsonify(shops)
    
    def get_shop_id(self, shop_id):
        # Return all shops with a given rating
        cursor.execute("SELECT shop_id FROM shops order by shop_id desc")
        result = cursor.fetchall()
        shops = []
        for shop in result:
            shops.append({
                "shop_id": shop[0],
                "name": shop[1],
                "rating": shop[2],
                "location": shop[3]
            })
        return jsonify(shops)

    def post(self):
        data = request.get_json()
        sname = data["sname"]
        rating = data["rating"]
        location = data["location"]
        cursor.execute("INSERT INTO shops (sname, rating, location) VALUES (%s, %s, %s)", (sname, rating, location))
        db.commit()
        return jsonify({"message": "Shop added successfully"})
