# How to run the code

## Step-01: Preparation
- Install Docker
- Unzip the source code folder
- Demo App Link: http://comp7640.ddns.net
- Demo PhpMyAdmin Link: http://comp7640.ddns.net:81

## Step-02: Run the code in local PC
- Open command prompt
- Switch to project directory
- Type `docker compose up -d`
- Open browser, type http://localhost:5000 to acess the GUI
- Open browser, type http://localhost:8081 to run phpmyadmin to check the DB. 
  `user = root, password = password`

## Step-03: Run Required Functionalities:

- In browser under http://localhost:5000 , click button under Shop management, you can
    1) show all shops
    2) add a new shop to the database.

- Click top left icon to return homepage and click button under Item management, you can
    1) show all items of a shop
    2) add a new item to the shop

- Click top left icon to return homepage and click button under "Item search, purchase, cancel", you can
    1) search items by keywords
    2) purchase item
    3) cancel order / cancel item in an order

## Step-04: Verified Required Functionalities:

- In browser under http://localhost:8081 , Login phpmyadmin to verify the data is correctly modified.

