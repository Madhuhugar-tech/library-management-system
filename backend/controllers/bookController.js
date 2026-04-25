const Book = require("../models/Book");

const addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, totalCopies, description } = req.body;

    if (!title || !author || !category || !isbn || !totalCopies) {
      return res.status(400).json({ message: "All required book fields must be provided" });
    }

    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({ message: "Book with this ISBN already exists" });
    }

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
      description
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, category, isbn, totalCopies, availableCopies, description } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.category = category ?? book.category;
    book.isbn = isbn ?? book.isbn;
    book.totalCopies = totalCopies ?? book.totalCopies;
    book.availableCopies = availableCopies ?? book.availableCopies;
    book.description = description ?? book.description;

    const updatedBook = await book.save();

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
};