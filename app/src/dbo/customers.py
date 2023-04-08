from flask import jsonify, request
from flask_restful import Resource
from dbo.dbconnect import *

# Define a cursor object to interact with the database
cursor = db.cursor()

class Customer(Resource):
    def get(self, customer_id =None):
        sql = ''
        customers = []
        if customer_id:
            sql = "SELECT * FROM customers WHERE customer_id = {customer_id}".format(customer_id = customer_id)
        else:
            sql = "SELECT * FROM customers order by customer_id"
        cursor.execute(sql)
        result = cursor.fetchall()
        for customer in result:
            customers.append({
                "customer_id": customer[0],
                "telephone": customer[1],
                "address": customer[2]
            })
        return jsonify(customers)