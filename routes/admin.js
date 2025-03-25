import express from 'express';
import { selectSql, insertSql, updateSql, deleteSql } from '../database/sql';

const router = express.Router();

// Admin Dashboard
router.get('/', async (req, res) => {
    if (req.session.user == undefined) {
        res.redirect('/');
    } else if (req.session.user.role === 'admin') {
        try {
            const books = await selectSql.getBooks();
            const authors = await selectSql.getAuthors();
            const awards = await selectSql.getAwards();
            const warehouses = await selectSql.getWarehouses();
            const inventories = await selectSql.getInventories();
            const contains = await selectSql.getContains();

            res.render('admin', {
                title: "Administer Page",
                books,
                authors,
                awards,
                warehouses,
                inventories,
                contains,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while loading the admin dashboard.');
        }
    } else {
        res.redirect('/');
    }
});

// Add Data
router.post('/add', async (req, res) => {
    const { table, data } = req.body;

    try {
        await insertSql.addData(table, data);
        res.send({ message: `${table} data added successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: `An error occurred while adding data to ${table}.` });
    }
});

// Update Data
router.post('/update', async (req, res) => {
    const { table, id, data } = req.body;

    try {
        await updateSql.updateData(table, id, data);
        res.send({ message: `${table} data updated successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: `An error occurred while updating data in ${table}.` });
    }
});

// Delete Data
router.post('/delete', async (req, res) => {
    const { table, id } = req.body;

    try {
        await deleteSql.deleteData(table, id);
        res.send({ message: `${table} data deleted successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: `An error occurred while deleting data from ${table}.` });
    }
});

export default router;
