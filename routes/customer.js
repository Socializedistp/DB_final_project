import express from 'express';
import { selectSql, insertSql, updateSql } from '../database/sql';

const router = express.Router();

// Customer dashboard
router.get('/', async (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/');
    } else if (req.session.user.role === 'customer') {
        try {
            // Fetch customer reservations and shopping basket
            const reservations = await selectSql.getCustomerReservations(req.session.user.username);
            const shoppingBasket = await selectSql.getCustomerShoppingBasket(req.session.user.username);


            res.render('customer', {
                title: "Customer Page",
                reservations,
                shoppingBasket,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while fetching customer data.');
        }
    } else {
        res.redirect('/');
    }
});


//book 검색기능
router.post('/search', async (req, res) => {
    const { searchQuery, searchType } = req.body;

    try {
        let results;
        if (searchType === 'book') {
            results = await selectSql.searchBooksByName(searchQuery);
        } else if (searchType === 'author') {
            results = await selectSql.searchBooksByAuthor(searchQuery);
        } else if (searchType === 'award') {
            results = await selectSql.searchBooksByAward(searchQuery);
        } else {
            return res.status(400).send({ error: 'Invalid search type' });
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while searching' });
    }
});


//Shopping_basket에 book 추가 기능
router.post('/add-to-basket', async (req, res) => {
    const { basketId, bookIsbn, quantity } = req.body;

    try {
        // Add a book to the shopping basket
        await insertSql.addToShoppingBasket(basketId, bookIsbn, quantity);
        res.send({ message: 'Book added to shopping basket successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while adding to the shopping basket.' });
    }
});

// Shopping_basket에서 책 구매하기
router.post('/purchase', async (req, res) => {
    const { basketId } = req.body;

    try {
        // Verify stock availability
        const insufficientStockBooks = await selectSql.checkStockForBasket(basketId);
        if (insufficientStockBooks.length > 0) {
            return res.status(400).send({
                error: 'Insufficient stock for some books.',
                books: insufficientStockBooks,
            });
        }

        // Update stock and mark items as purchased
        await updateSql.purchaseBooksInBasket(basketId);
        res.send({ message: 'Purchase completed successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during purchase.' });
    }
});


//reservation
router.post('/reserve', async (req, res) => {
    const { pickupTime } = req.body;
    console.log(pickupTime)
    const customerEmail = req.session.user.email;

    try {
        // Check for conflicting reservations within 10 minutes before/after
        const conflictingReservations = await selectSql.checkConflictingReservations(customerEmail, pickupTime);
        if (conflictingReservations.length > 0) {
            return res.status(400).send({ error: 'There is a conflicting reservation within 10 minutes of the selected time.' });
        }

        // Create reservation
        await insertSql.createReservation(customerEmail, pickupTime);
        res.send({ message: 'Reservation created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while creating the reservation.' });
    }
});


export default router;
