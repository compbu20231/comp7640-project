import mysql.connector
import time
import os

def connectDB():
    db = mysql.connector.connect(
    host=os.environ["host"],
    user=os.environ["user"],
    password=os.environ["password"],
    database=os.environ["database"],
    port=os.environ["port"])
    return db

while True:
    try:
        db = connectDB()
    except:
        time.sleep(3)
        continue
    break