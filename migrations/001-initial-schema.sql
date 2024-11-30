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
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_name STRING,
    order_date DATE,
    order_price DECIMAL(10, 2),
    user_id INT,
    test STRING
);

-- Down
DROP TABLE services;
DROP TABLE users;
DROP TABLE orders;