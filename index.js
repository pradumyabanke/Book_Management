const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const router = require("./src/Routes/route");
const Book = require("./src/Models/BookModel");

const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);



//=============[ Add a new book (title, author, summary) ]=========================/

app.post('/api/books', (req, res) => {
    const booksData = req.body;

    if (!Array.isArray(booksData)) {
        return res.status(400).json({ status: false, message: 'Invalid data format. Expecting an array of books.' });
    }

    const savedBooks = [];

    async function saveBooks() {
        for (const book of booksData) {
            const { title, author, summary } = book;

            if (!title || !author || !summary) {
                return res.status(400).json({ status: false, message: 'All fields are required for each book.' });
            }

            try {
                const newBook = new Book({ title, author, summary });
                const savedBook = await newBook.save();
                savedBooks.push(savedBook);
            } catch (err) {
                return res.status(500).json({ status: false, error: err.message });
            }
        }

        return res.status(201).json({ status: true, message: 'Books created successfully', books: savedBooks });
    }

    saveBooks();
});

//=============[ View a list of all books ]=====================/

app.get('/api/Viewbooks', async (req, res) => {
    try {
        const allBooks = await Book.find();

        return res.status(201).send({
            status: true,
            message: "Books View Successfully",
            Books: allBooks,
        });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
});

//===========[ View details of a specific book by its ID ]========================/

app.get('/api/Views_books/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).send({
                status: false,
                message: "Book Not Found!!",
            });
        }

        return res.status(201).send({
            status: true,
            message: "Book View Successfully",
            data: book,
        });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
});

//=============[ Update a book's details ]===================/

app.put('/api/Update-Books/:id', async (req, res) => {
    const bookId = req.params.id;
    const { title, author, summary } = req.body;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).send({
                status: false,
                message: "Book Not Found!!",
            });
        }
        if (title) {
            book.title = title;
        }
        if (author) {
            book.author = author;
        }
        if (summary) {
            book.summary = summary;
        }

        const updatedBook = await book.save();

        return res.status(200).send({
            status: true,
            message: "Book Updated Successfully",
            data: updatedBook,
        });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
});

//==============[ Delete a book ]============================/

app.delete('/api/Delete-book/:id', async (req, res) => {
    const bookId = req.params.id;

    try {
        const book = await Book.findByIdAndDelete(bookId);

        if (!book) {
            return res.status(404).send({
                status: false,
                message: "Book Not Found!!",
            });
        }

        return res.status(200).send({
            status: true,
            message: "Book Deleted Successfully",
            Deleted: book,
        });
    } catch (err) {
        return res.status(500).json({ status: false, error: err.message });
    }
});





module.exports = router;

//===================== [ Database Connection ] =============/

mongoose
    .connect(
        "mongodb+srv://BookManagement:uPFQ9lh2KoeoctVj@cluster0.ayhfvag.mongodb.net/"
    )
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err));

app.use("/", router);

app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`);
});



//mongodb+srv://BookManagement:uPFQ9lh2KoeoctVj@cluster0.ayhfvag.mongodb.net/
//uPFQ9lh2KoeoctVj