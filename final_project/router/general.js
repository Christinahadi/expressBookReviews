const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if user already exists
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered." });
});

// Get the book list available in the shop using async-await
public_users.get('/', async (req, res) => {
    try {
        // Simulating an asynchronous request using a Promise
        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books }), 1000);
        });

        return res.status(200).json(response.data); // Return books
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});


// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Simulating an asynchronous request
        const response = await new Promise((resolve) => {
            setTimeout(() => resolve({ data: books[isbn] }), 1000);
        });

        if (response.data) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Get book details based on Author using async-await
public_users.get('/author/:author', async (req, res) => {
    try {
        const authorName = req.params.author.toLowerCase(); // Convert author to lowercase for consistency

        // Simulating an async request with a promise
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === authorName);
                resolve({ data: filteredBooks });
            }, 1000);
        });

        if (response.data.length > 0) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// Get book details based on Title using async-await
public_users.get('/title/:title', async (req, res) => {
    try {
        const bookTitle = req.params.title.toLowerCase(); // Convert title to lowercase for consistency

        // Simulating an async request with a promise
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === bookTitle);
                resolve({ data: filteredBooks });
            }, 1000);
        });

        if (response.data.length > 0) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title" });
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn]; // Find book by ISBN

    if (book && book.reviews) {
        return res.status(200).json(book.reviews); // Return reviews if found
    } else {
        return res.status(404).json({ message: "No reviews found for this book" }); // Handle no reviews
    }
});

module.exports.general = public_users;
