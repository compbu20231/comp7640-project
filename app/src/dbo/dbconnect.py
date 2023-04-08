import mysql.connector
import time

def connectDB():
    db = mysql.connector.connect(
    host="mydb",
    user="root",
    password="password",
    database="retaildatabase",
    port="3306")
    return db

while True:
    try:
        db = connectDB()
    except:
        time.sleep(3)
        continue
    break