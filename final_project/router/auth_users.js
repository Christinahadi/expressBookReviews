const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "username", password: "password" },
];

const isValid = (username) => {
    return username && username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
    console.log(`Checking login for: ${username} - ${password}`);
    console.log("Users array:", users);
    return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Validate user credentials
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid Login. Check username and password." });
    }

    // Generate JWT token
    let accessToken = jwt.sign({ username: username }, 'access', { expiresIn: "1h" });

    // Store JWT token in session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    // Check if the user is logged in
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize the reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Check if the user is logged in
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
