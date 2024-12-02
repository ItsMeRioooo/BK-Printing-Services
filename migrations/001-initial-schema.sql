-- Up
CREATE TABLE Services (
    service_id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name STRING,
    service_description STRING,
    service_price DECIMAL(10, 2),
    service_img STRING
);

CREATE TABLE Users (
    user_name STRING,
    user_email STRING,
    user_password STRING,
    user_perms STRING
);

CREATE TABLE Orders (
    order_id INTEGER,
    order_name STRING,
    order_date DATE,
    order_price DECIMAL(10, 2),
    customer_name STRING,
    customer_contact STRING,
    customer_message STRING,
    order_file STRING, 
    order_img STRING,
    order_mode STRING,
    order_status STRING
);

CREATE TABLE History (
    order_id INTEGER,
    order_name STRING,
    order_date DATE,
    order_price DECIMAL(10, 2),
    customer_name STRING,
    customer_contact STRING,
    customer_message STRING,
    order_file STRING, 
    order_img STRING,
    order_mode STRING,
    order_status STRING
);

-- Down
DROP TABLE services;
DROP TABLE users;
DROP TABLE orders;
DROP TABLE history;