-- book table's index(이거까진 입력했음)
CREATE INDEX idx_book_title ON Book(title);

CREATE INDEX idx_book_category ON Book(category);

--author table's index
CREATE INDEX idx_author_name ON Author(name);

--award table's index
CREATE INDEX idx_award_name ON Award(name);

--contains table's index
CREATE INDEX idx_contains_basket_book ON Contains(basket_id, book_isbn);

--inventory table's index
CREATE INDEX idx_inventory_book_warehouse ON Inventory(book_isbn, warehouse_code);
