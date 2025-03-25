import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

// Render Login Page
router.get('/', (req, res) => {
    res.render('login');
});

// Handle Login Logic
router.post('/', async (req, res) => {
    const { username, password } = req.body; // Extract input data from form
    const users = await selectSql.getUser(); // Fetch all users from the database

    let loggedInUser = null;

    // Check user credentials
    for (const user of users) {
        if (username === user.username && password === user.password) {
            console.log('Login success:', user.username);
            // Set session data for the logged-in user
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role,
                checkLogin: true
            };
            loggedInUser = user;
            break; // Stop checking once login is successful
        }
    }

    // Handle login success or failure
    if (!loggedInUser) {
        console.log('Login failed!');
        res.send(`
            <script>
                alert('Login failed! Invalid username or password.');
                location.href = '/';
            </script>
        `);
    } else if (req.session.user.role === 'admin') {
        res.redirect('/admin'); // Redirect to admin page
    } else if (req.session.user.role === 'customer') {
        res.redirect('/customer'); // Redirect to customer page
    }
});

export default router;
