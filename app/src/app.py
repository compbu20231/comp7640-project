from flask import Flask, render_template, redirect
from flask_restful import Api
from dbo.customers import Customer
from dbo.orders import Order
from dbo.items import Item
from dbo.shops import Shop
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)


api.add_resource(Customer, "/customers", "/customers/<int:customer_id>")
api.add_resource(Shop, "/shops", "/shops/<int:shop_id>")
api.add_resource(Order, "/orders","/orders/items", "/orders/<int:order_id>","/orders/items/<int:oi_id>",)
api.add_resource(Item, "/items", "/items/<int:item_id>", "/items/shop/<int:shop_id>", "/items/kw/<string:kw>")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/static/")
def backToHome():
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True, use_reloader=True, port=5000, host="app")