INSERT INTO user (id, username, password, role)
VALUES 
    (1, 'admin1', 'adminpass1', 'admin'),
    (2, 'admin2', 'adminpass2', 'admin'),
    (3, 'customer1', 'custpass1', 'customer'),
    (4, 'customer2', 'custpass2', 'customer');

INSERT INTO administrator (id, user_id)
VALUES 
    (1, 1),
    (2, 2);


INSERT INTO customer (email, name, phone, address, user_id)
VALUES 
    ('customer1@example.com', 'John Doe', '123-456-7890', '123 Main St', 3),
    ('customer2@example.com', 'Jane Smith', '987-654-3210', '456 Elm St', 4);


INSERT INTO book (isbn, title, year, price, category)
VALUES 
    ('9780131103627', 'C Programming Language', 1988, 59.99, 'Programming'),
    ('9780321356680', 'Effective Java', 2008, 55.99, 'Programming'),
    ('9780596009205', 'Learning Python', 2013, 45.00, 'Programming');


INSERT INTO author (name, address, url)
VALUES 
    ('Brian W. Kernighan', 'Princeton, NJ', 'http://www.kernighan.com'),
    ('Joshua Bloch', 'San Francisco, CA', 'http://www.effectivejava.com'),
    ('Mark Lutz', 'Asheville, NC', 'http://www.learningpython.com');


INSERT INTO award (name, year)
VALUES 
    ('Best Programming Book', 2014),
    ('Java Hall of Fame', 2009),
    ('Turing Award', 1983);


INSERT INTO awardedto (id, award_name, book_isbn)
VALUES 
    (1, 'Best Programming Book', '9780131103627'),
    (2, 'Java Hall of Fame', '9780321356680'),
    (3, 'Turing Award', '9780596009205');


INSERT INTO receivedby (id, award_name, author_name)
VALUES 
    (1, 'Best Programming Book', 'Brian W. Kernighan'),
    (2, 'Java Hall of Fame', 'Joshua Bloch'),
    (3, 'Turing Award', 'Mark Lutz');


INSERT INTO writtenby (id, author_name, book_isbn)
VALUES 
    (1, 'Brian W. Kernighan', '9780131103627'),
    (2, 'Joshua Bloch', '9780321356680'),
    (3, 'Mark Lutz', '9780596009205');


INSERT INTO warehouse (code, address, phone)
VALUES 
    ('WH001', '123 Warehouse Blvd', '123-456-7890'),
    ('WH002', '456 Storage Rd', '987-654-3210');


INSERT INTO inventory (id, book_isbn, warehouse_code, number)
VALUES 
    (1, '9780131103627', 'WH001', 20),
    (2, '9780321356680', 'WH002', 15),
    (3, '9780596009205', 'WH001', 30);

INSERT INTO shoppingbasket (basketid, order_date, customer_email)
VALUES 
    (1, '2023-12-01', 'customer1@example.com'),
    (2, '2023-12-02', 'customer2@example.com');

INSERT INTO basketof (id, basket_id, customer_email)
VALUES 
    (1, 1, 'customer1@example.com'),
    (2, 2, 'customer2@example.com');

INSERT INTO contains (id, basket_id, book_isbn, number)
VALUES 
    (1, 1, '9780131103627', 1),
    (2, 1, '9780321356680', 2),
    (3, 2, '9780596009205', 1);

INSERT INTO reservation (id, reservation_date, pickup_time, customer_email)
VALUES 
    (1, '2023-12-05', '10:30:00', 'customer1@example.com'),
    (2, '2023-12-06', '14:00:00', 'customer2@example.com');
