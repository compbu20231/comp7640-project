from flask import jsonify, request
from flask_restful import Resource
from dbo.dbconnect import *
import urllib.parse

# Define a cursor object to interact with the database
cursor = db.cursor(buffered=True)

class Item(Resource):
    def get(self, item_id=None, shop_id=None, kw=None):
        sql = ''
        if shop_id:
            sql = "SELECT * FROM items WHERE shop_id = {shop_id}".format(shop_id = shop_id)
        elif item_id:
            sql = "SELECT * FROM items WHERE item_id = {item_id}".format(item_id = item_id)
        elif kw:
            kw = urllib.parse.unquote(kw)
            sql = '''
                   select * from items where item_id in (
                   select i.item_id from items i left outer join item_keywords ik
                   on i.item_id = ik.item_id
                   where i.name = "{item_name}" or ik.keyword = "{item_name}")
                  '''.format(item_name = kw)
        else:
            sql = "SELECT * FROM items order by item_id desc"
        cursor.execute(sql)
        result = cursor.fetchall()
        items = []
        for item in result:
            items.append({
                "item_id": item[0],
                "name": item[1],
                "price": item[2],
                "shop_id": item[3]
            })
        return jsonify(items)



    def post(self):
        data = request.get_json()
        name = data["name"]
        price = data["price"]
        shop_id = data["shop_id"]
        kw1 = data["kw1"]
        kw2 = data["kw2"]
        kw3 = data["kw3"]
        message = ''
        try:
            cursor.execute("INSERT INTO items (name, price, shop_id) VALUES (%s, %s, %s)", (name, price, shop_id))
            item_id = cursor.lastrowid
            if kw1:
                cursor.execute("INSERT INTO item_keywords (item_id, keyword) VALUES (%s, %s)", (item_id, kw1))
            if kw2:
                cursor.execute("INSERT INTO item_keywords (item_id, keyword) VALUES (%s, %s)", (item_id, kw2))
            if kw3:
                cursor.execute("INSERT INTO item_keywords (item_id, keyword) VALUES (%s, %s)", (item_id, kw3))
            db.commit()
            message = "Item added successfully"
        except Exception as e:
            db.rollback()
            message = str(e)
        return jsonify({"message": message})

    def put(self, item_id):
        print('item_id', item_id)
        data = request.get_json()
        name = data["name"]
        price = data["price"]
        shop_id = data["shop_id"]
        message = ''
        try:
            cursor.execute("UPDATE items SET name=%s, price=%s, shop_id=%s WHERE item_id=%s", (name, price, shop_id, str(item_id)))
            db.commit()
            message = "Item updated successfully"
        except Exception as e:
            message = str(e)
        return jsonify({"message": message})

    def delete(self, item_id):
        cursor.execute("DELETE FROM items WHERE item_id=" + str(item_id))
        db.commit()
        return jsonify({"message": "Item deleted successfully"})
