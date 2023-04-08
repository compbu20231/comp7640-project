from flask import jsonify, request
from flask_restful import Resource
from dbo.dbconnect import *
from urllib.parse import urlparse



# Define a cursor object to interact with the database
cursor = db.cursor()

class Order(Resource):
    def get(self, order_id =None):
        sql = ''
        is_order_item = urlparse(request.url).path == "/orders/items"
        orders = []
        if is_order_item:
            sql = "SELECT * FROM order_items order by order_id"
        elif order_id:
            sql = "SELECT * FROM orders where order_id = {order_id}".format(order_id = order_id)
        else:
            sql = "SELECT * FROM orders order by order_id"
        cursor.execute(sql)
        result = cursor.fetchall()
        for order in result:
            if is_order_item:
                orders.append({
                    "oi_id": order[0],
                    "order_id": order[1],
                    "item_id": order[2],
                    "quantity": order[3],
                })
            else:
                orders.append({
                    "order_id": order[0],
                    "customer_id": order[1]
                })
        return jsonify(orders)
    
    def post(self):
        message = ""
        try:
            data = request.get_json()
            customer_id = data["customer_id"]
            cursor.execute("INSERT INTO orders (customer_id) VALUES (%s)", (customer_id,))
            order_id = cursor.lastrowid
            orders = data["orders"]
            for o in orders:
                item_id = o["item_id"]
                quantity = o["quantity"]
                cursor.execute("INSERT INTO order_items (order_id, item_id, quantity) VALUES (%s,%s,%s)", (order_id,item_id,quantity))
            
            db.commit()
            message = "Order create successfully"
        except Exception as e:
            db.rollback()
            message = str(e)
        return jsonify({"message": message})
    
    def delete(self, order_id = None, oi_id = None):
        message = ""
        if order_id:
            cursor.execute("DELETE FROM orders WHERE order_id = %s", (order_id,))
            message = "Order cancelled successfully"
        elif oi_id:
            cursor.execute("DELETE FROM order_items WHERE oi_id = %s", (oi_id,))
            message = "Item cancelled successfully"
        db.commit()
        return jsonify({"message": message})