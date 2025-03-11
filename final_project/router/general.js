const express = require('express');
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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn]; // Find book by ISBN

    if (book) {
        return res.status(200).json(book); // Return book details
    } else {
        return res.status(404).json({ message: "Book not found" }); // Handle ISBN not found
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorName = req.params.author.toLowerCase(); // Retrieve and convert author to lowercase
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === authorName);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks); // Return books matching the author
    } else {
        return res.status(404).json({ message: "No books found for this author" }); // Handle no matches
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title.toLowerCase(); // Convert title to lowercase for matching
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === bookTitle);

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks); // Return books matching the title
    } else {
        return res.status(404).json({ message: "No books found with this title" }); // Handle no matches
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
