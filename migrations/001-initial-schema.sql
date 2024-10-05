-- Up
CREATE TABLE Services (
    service_name STRING,
    service_description STRING,
    service_price DECIMAL(10, 2),
    service_img BLOB
);
CREATE TABLE Users (
    user_name STRING,
    user_email STRING,
    user_password STRING,
    user_role STRING
);
CREATE TABLE Orders (
    order_id INT,
    order_date DATE,
    order_total DECIMAL(10, 2),
    user_id INT
);

-- Down
DROP TABLE services;
DROP TABLE users;
DROP TABLE orders;