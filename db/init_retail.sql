CREATE DATABASE retaildatabase;

USE retaildatabase;


CREATE TABLE shops (
  shop_id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(3,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  PRIMARY KEY (shop_id)
);

CREATE TABLE items (
  item_id INT AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  shop_id INT NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (shop_id) REFERENCES shops (shop_id)
);

CREATE TABLE item_keywords (
  ik_id INT AUTO_INCREMENT,
  item_id INT NOT NULL,
  keyword VARCHAR(50) NOT NULL,
  PRIMARY KEY (ik_id),
  FOREIGN KEY (item_id) REFERENCES items (item_id)
);

DELIMITER $$
CREATE TRIGGER max_keywords
BEFORE INSERT
ON item_keywords FOR EACH ROW
BEGIN
    DECLARE num_keywords INT;
    SELECT COUNT(*) INTO num_keywords FROM item_keywords WHERE item_id = new.item_id;
    IF (num_keywords >= 3) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot insert more than 3 keywords for an item';
	END IF;
END $$
DELIMITER ;


CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT,
  telephone VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  PRIMARY KEY (customer_id)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT,
  customer_id INT NOT NULL,
  -- order_status VARCHAR(20) NOT NULL,
  PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id) 
);

CREATE TABLE order_items (
  oi_id INT AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (oi_id),
  FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items (item_id)
);

INSERT INTO shops (name, rating, location) VALUES
('Shop A', 4.5, 'New York'),
('Shop B', 3.8, 'Los Angeles'),
('Shop C', 4.2, 'Chicago'),
('Shop D', 4.0, 'Houston'),
('Shop E', 4.9, 'San Francisco');

INSERT INTO items (name, price, shop_id) VALUES
('Item A', 10.99, 1),
('Item B', 29.99, 2),
('Item C', 15.99, 1),
('Item D', 7.50, 3),
('Item E', 55.00, 5);

INSERT INTO item_keywords (item_id, keyword) VALUES
(1, 'clothes'), (1, 'accessories'), (2, 'electronics'), (2, 'gadgets'), (3, 'furniture'),
(3, 'home decor'), (4, 'food'), (4, 'snacks'), (5, 'jewelry'), (5, 'luxury');

INSERT INTO customers (telephone, address) VALUES
('1234567890', '123 Main St, New York, NY'),
('2345678901', '456 Elm St, Los Angeles, CA'),
('3456789012', '789 Oak St, Chicago, IL'),
('4567890123', '12 Pine St, Houston, TX'),
('5678901234', '345 Maple St, San Francisco, CA');

INSERT INTO orders (customer_id) VALUES
(1),
(2),
(3),
(4),
(5);

INSERT INTO order_items (order_id, item_id, quantity) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 4, 2),
(5, 5, 1);