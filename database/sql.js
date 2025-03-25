import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user:'root',
    password: 'seol1727',
    database: 'bookstoretest_db',
});

const promisePool = pool.promise();


//select
export const selectSql = {
    getUser: async () => {
        const [rows] = await promisePool.query(`select * from user`);
        return rows;
    },

    getBooks: async () => {
        const query = `SELECT * FROM Book`;
        const [rows] = await promisePool.query(query);
        return rows;
    },
    getAuthors: async () => {
        const query = `SELECT * FROM Author`;
        const [rows] = await promisePool.query(query);
        return rows;
    },
    getAwards: async () => {
        const query = `SELECT * FROM Award`;
        const [rows] = await promisePool.query(query);
        return rows;
    },
    getWarehouses: async () => {
        const query = `SELECT * FROM Warehouse`;
        const [rows] = await promisePool.query(query);
        return rows;
    },
    getInventories: async () => {
        const query = `SELECT * FROM Inventory`;
        const [rows] = await promisePool.query(query);
        return rows;
    },
    getContains: async () => {
        const query = `SELECT * FROM Contains`;
        const [rows] = await promisePool.query(query);
        return rows;
    },

    // Book 이름으로 검색
    searchBooksByName: async (searchQuery) => {
        const query = `
            SELECT b.isbn, b.title, b.year, b.price, b.category
            FROM Book b
            WHERE b.title LIKE ?;
        `;
        const [rows] = await promisePool.query(query, [`%${searchQuery}%`]);
        return rows;
    },

    // Author 이름으로 검색
    searchBooksByAuthor: async (searchQuery) => {
        const query = `
            SELECT b.isbn, b.title, b.year, b.price, b.category
            FROM Book b
            JOIN WrittenBy wb ON b.isbn = wb.book_isbn
            JOIN Author a ON wb.author_name = a.name
            WHERE a.name LIKE ?;
        `;
        const [rows] = await promisePool.query(query, [`%${searchQuery}%`]);
        return rows;
    },

    // Award 이름으로 검색
    searchBooksByAward: async (searchQuery) => {
        const query = `
            SELECT b.isbn, b.title, b.year, b.price, b.category
            FROM Book b
            JOIN AwardedTo at ON b.isbn = at.book_isbn
            JOIN Award aw ON at.award_name = aw.name
            WHERE aw.name LIKE ?;
        `;
        const [rows] = await promisePool.query(query, [`%${searchQuery}%`]);
        return rows;
    },
    // 고객의 Reservation 리스트 조회
    getCustomerReservations: async (username) => {
        const query = `
            SELECT 
                r.id, 
                r.reservation_date, 
                r.pickup_time
            FROM 
                reservation r
            INNER JOIN 
                customer c ON r.customer_email = c.email
            INNER JOIN 
                user u ON c.user_id = u.id
            WHERE 
                u.username = ?;
        `;
        const [rows] = await promisePool.query(query, [username]);
        return rows;
    },

    // 고객의 Shopping_basket 리스트 조회
    getCustomerShoppingBasket: async (username) => {
        const query = `
            SELECT 
                sb.basketid, 
                sb.order_date, 
                c.book_isbn, 
                c.number
            FROM 
                shoppingbasket sb
            INNER JOIN 
                contains c ON sb.basketid = c.basket_id
            INNER JOIN 
                customer cu ON sb.customer_email = cu.email
            INNER JOIN 
                user u ON cu.user_id = u.id
            WHERE 
                u.username = ?;
        `;
        const [rows] = await promisePool.query(query, [username]);
        console.log("Query Result:", rows); // Debugging
        return rows;
    },

    //장바구니 재고확인
    checkStockForBasket: async (basketId) => {
        const query = `
            SELECT c.book_isbn, c.number AS requested_quantity, i.number AS available_stock
            FROM Contains c
            JOIN Inventory i ON c.book_isbn = i.book_isbn
            WHERE c.basket_id = ? AND c.number > i.number;
        `;
        const [rows] = await promisePool.query(query, [basketId]);
        return rows;
    },

    // 책 재고 확인
    getBookStock: async (bookIsbn) => {
        const query = `
            SELECT SUM(number) AS stock
            FROM Inventory
            WHERE book_isbn = ?;
        `;
        const [rows] = await promisePool.query(query, [bookIsbn]);
        return rows[0].stock || 0;
    },

    // Check for conflicting reservations within 10 minutes
    checkConflictingReservations: async (customerEmail, pickupTime) => {
        const query = `
            SELECT *
            FROM Reservation
            WHERE customer_email = ?
            AND ABS(TIMESTAMPDIFF(MINUTE, TIMESTAMP(reservation_date, pickup_time), ?)) < 10;
        `;
        const [rows] = await promisePool.query(query, [customerEmail, pickupTime]);
        return rows;
    },

}

export const insertSql = {
    addData: async (table, data) => {
        const fields = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');

        const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
        await promisePool.query(query, values);
    },

    addToShoppingBasket: async (basketId, bookIsbn, quantity) => {
        const query = `
            INSERT INTO Contains (basket_id, book_isbn, number)
            VALUES (?, ?, ?);
        `;
        await promisePool.query(query, [basketId, bookIsbn, quantity]);
    },

    // Create a reservation
    createReservation: async (customerEmail, pickupTime) => {
        const query = `
            INSERT INTO Reservation (reservation_date, pickup_time, customer_email)
            VALUES (CURDATE(), ?, ?);
        `;
        await promisePool.query(query, [pickupTime, customerEmail]);
    },

};

//update
export const updateSql = {
    updateData: async (table, id, data) => {
        // Map table to primary key
        const primaryKey = {
            Book: 'isbn',
            Author: 'name',
            Award: 'name',
            Warehouse: 'code',
            Inventory: 'id',
            Contains: 'id',
        }[table];

        if (!primaryKey) {
            throw new Error(`Unknown table: ${table}`);
        }

        const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];

        const query = `UPDATE ${table} SET ${updates} WHERE ${primaryKey} = ?`;
        await promisePool.query(query, values);
    },
    purchaseBooksInBasket: async (basketId) => {
        const updateStockQuery = `
            UPDATE Inventory i
            JOIN Contains c ON i.book_isbn = c.book_isbn
            SET i.number = i.number - c.number
            WHERE c.basket_id = ?;
        `;

        const markPurchaseQuery = `
            UPDATE ShoppingBasket
            SET order_date = NOW()
            WHERE basketid = ?;
        `;

        // Perform both updates as part of a transaction
        const connection = await promisePool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query(updateStockQuery, [basketId]);
            await connection.query(markPurchaseQuery, [basketId]);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },
}

//delete
export const deleteSql = {
    deleteData: async (table, id) => {
        // Map table to primary key
        const primaryKey = {
            Book: 'isbn',
            Author: 'name',
            Award: 'name',
            Warehouse: 'code',
            Inventory: 'id',
            Contains: 'id',
        }[table];

        if (!primaryKey) {
            throw new Error(`Unknown table: ${table}`);
        }

        const query = `DELETE FROM ${table} WHERE ${primaryKey} = ?`;
        await promisePool.query(query, [id]);
    },

}