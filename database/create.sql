-- Create database schema
CREATE SCHEMA IF NOT EXISTS Bookstoretest_DB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Bookstoretest_DB;

-- Author Table
CREATE TABLE Author (
    name VARCHAR(255) NOT NULL PRIMARY KEY, -- Underlined key
    address TEXT,
    url VARCHAR(255)
);

-- Award Table
CREATE TABLE Award (
    name VARCHAR(255) NOT NULL PRIMARY KEY, -- Underlined key
    year INT
);

-- Book Table
CREATE TABLE Book (
    isbn VARCHAR(13) NOT NULL PRIMARY KEY, -- Underlined key
    title VARCHAR(255) NOT NULL,
    year INT,
    price DECIMAL(10, 2),
    category VARCHAR(255)
);

-- User Table
CREATE TABLE User (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Primary key
    username VARCHAR(255) NOT NULL UNIQUE, -- Unique username
    password VARCHAR(255) NOT NULL, -- Encrypted password
    role ENUM('customer', 'admin') NOT NULL -- Role of the user
);

-- Administrator Table
CREATE TABLE Administrator (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Primary key
    user_id BIGINT NOT NULL, -- Links to User table
    FOREIGN KEY (user_id) REFERENCES User(id) -- Foreign key reference to User
);

-- Customer Table
CREATE TABLE Customer (
    email VARCHAR(255) NOT NULL PRIMARY KEY, -- Underlined key
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT
);

-- Warehouse Table
CREATE TABLE Warehouse (
    code VARCHAR(50) NOT NULL PRIMARY KEY, -- Underlined key
    address TEXT,
    phone VARCHAR(15)
);

-- Inventory Table
CREATE TABLE Inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_isbn VARCHAR(13) NOT NULL,
    warehouse_code VARCHAR(50) NOT NULL,
    number INT DEFAULT 0,
    FOREIGN KEY (book_isbn) REFERENCES Book(isbn),
    FOREIGN KEY (warehouse_code) REFERENCES Warehouse(code)
);

-- Shopping Basket Table
CREATE TABLE ShoppingBasket (
    basketid BIGINT NOT NULL PRIMARY KEY, -- Underlined key
    order_date DATE,
    customer_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_email) REFERENCES Customer(email)
);

-- Contains Table
CREATE TABLE Contains (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    basket_id BIGINT NOT NULL,
    book_isbn VARCHAR(13) NOT NULL,
    number INT NOT NULL,
    FOREIGN KEY (basket_id) REFERENCES ShoppingBasket(basketid),
    FOREIGN KEY (book_isbn) REFERENCES Book(isbn)
);

-- Reservation Table
CREATE TABLE Reservation (
    id BIGINT NOT NULL PRIMARY KEY, -- Underlined key
    reservation_date DATE,
    pickup_time TIME,
    customer_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (customer_email) REFERENCES Customer(email)
);

-- ReceivedBy Table (Relationship between Award and Author)
CREATE TABLE ReceivedBy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    award_name VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (award_name) REFERENCES Award(name),
    FOREIGN KEY (author_name) REFERENCES Author(name)
);

-- AwardedTo Table (Relationship between Award and Book)
CREATE TABLE AwardedTo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    award_name VARCHAR(255) NOT NULL,
    book_isbn VARCHAR(13) NOT NULL,
    FOREIGN KEY (award_name) REFERENCES Award(name),
    FOREIGN KEY (book_isbn) REFERENCES Book(isbn)
);

-- WrittenBy Table (Relationship between Author and Book)
CREATE TABLE WrittenBy (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    book_isbn VARCHAR(13) NOT NULL,
    FOREIGN KEY (author_name) REFERENCES Author(name),
    FOREIGN KEY (book_isbn) REFERENCES Book(isbn)
);

-- BasketOf Table (Relationship between Customer and Shopping Basket)
CREATE TABLE BasketOf (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    basket_id BIGINT NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    FOREIGN KEY (basket_id) REFERENCES ShoppingBasket(basketid),
    FOREIGN KEY (customer_email) REFERENCES Customer(email)
);

-- altertable
ALTER TABLE Customer ADD user_id BIGINT NOT NULL;
ALTER TABLE Customer ADD FOREIGN KEY (user_id) REFERENCES User(id);

