-- Up
CREATE TABLE Services (
    service_name STRING,
    service_description STRING,
    service_price DECIMAL(10, 2),
    service_img BLOB
);

-- Down
DROP TABLE services;