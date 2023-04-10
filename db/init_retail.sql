CREATE DATABASE retaildatabase;

USE retaildatabase;


CREATE TABLE shops (
  shop_id INT AUTO_INCREMENT,
  sname VARCHAR(255) NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  location VARCHAR(255) NOT NULL,
  PRIMARY KEY (shop_id)
);

CREATE TABLE items (
  item_id INT AUTO_INCREMENT,
  iname VARCHAR(255) NOT NULL,
  price DECIMAL(10,1) NOT NULL,
  shop_id INT NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE CASCADE
);

CREATE TABLE item_keywords (
  ik_id INT AUTO_INCREMENT,
  item_id INT NOT NULL,
  keyword VARCHAR(50) NOT NULL,
  PRIMARY KEY (ik_id),
  FOREIGN KEY (item_id) REFERENCES items (item_id)  ON DELETE CASCADE
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
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  oi_id INT AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (oi_id),
  FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items (item_id)  ON DELETE CASCADE
);

INSERT INTO shops (sname, rating, location) VALUES
('Shop A', 4.5, 'Location A'),
('Shop B', 3.8, 'Location B'),
('Shop C', 4.2, 'Location C'),
('Shop D', 4.0, 'Location E'),
('Shop E', 4.9, 'Location F');

INSERT INTO items (iname, price, shop_id) VALUES
('Item A', 10.9, 1),
('Item B', 29.1, 2),
('Item C', 15.9, 3),
('Item D', 7.5, 4),
('Item E', 50.1, 5),
('Item F', 61, 1),
('Item G', 72, 2),
('Item H', 53, 3),
('Item I', 54, 4),
('Item J', 54.2, 5);

INSERT INTO item_keywords (item_id, keyword) VALUES
(1, 'kw1'), (1, 'kwa'), (2, 'kw2'), (2, 'kwb'), (3, 'kw3'),
(3, 'kwc'), (4, 'kw4'), (4, 'kwd'), (5, 'kw5'), (5, 'kwe');

INSERT INTO customers (telephone, address) VALUES
('1234567890', 'Address 1'),
('2345678901', 'Address 2'),
('3456789012', 'Address 3'),
('4567890123', 'Address 4'),
('5678901234', 'Address 5');

INSERT INTO orders (customer_id) VALUES
(1),
(2),
(3),
(4),
(5);

INSERT INTO order_items (order_id, item_id, quantity) VALUES
(1, 1, 2),
(1, 2, 1),
(1, 2, 3),
(2, 2, 1),
(3, 1, 3),
(3, 3, 2),
(3, 4, 2),
(4, 4, 2),
(5, 1, 1),
(5, 2, 2),
(5, 3, 3),
(5, 5, 1)