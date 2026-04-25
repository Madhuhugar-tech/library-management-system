const express = require("express");
const router = express.Router();

const Book = require("../models/Book");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL BOOKS
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// GET SINGLE BOOK
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch book" });
  }
});

// ADD BOOK (single + bulk)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      for (const b of req.body) {
        if (!b.title || !b.author || !b.category || !b.isbn || !b.totalCopies) {
          return res.status(400).json({
            message: "All required fields must be provided for every book"
          });
        }
      }

      const isbns = req.body.map((b) => b.isbn);
      const existing = await Book.find({ isbn: { $in: isbns } });

      if (existing.length > 0) {
        return res.status(400).json({
          message: "Some books already exist (duplicate ISBN)"
        });
      }

      const books = req.body.map((b) => ({
        ...b,
        availableCopies: b.totalCopies
      }));

      const inserted = await Book.insertMany(books);
      return res.status(201).json(inserted);
    }

    const { title, author, category, isbn, totalCopies, description, coverImage } = req.body;

    if (!title || !author || !category || !isbn || !totalCopies) {
      return res.status(400).json({
        message: "All required book fields must be provided"
      });
    }

    const existingBook = await Book.findOne({ isbn });

    if (existingBook) {
      return res.status(400).json({
        message: "Book with this ISBN already exists"
      });
    }

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
      description,
      coverImage
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE BOOK
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, author, category, isbn, totalCopies, description, coverImage } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.category = category ?? book.category;
    book.isbn = isbn ?? book.isbn;
    book.totalCopies = totalCopies ?? book.totalCopies;
    book.description = description ?? book.description;
    book.coverImage = coverImage ?? book.coverImage;

    if (book.availableCopies > book.totalCopies) {
      book.availableCopies = book.totalCopies;
    }

    const updatedBook = await book.save();

    res.json({
      message: "Book updated successfully",
      book: updatedBook
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update book" });
  }
});

// DELETE BOOK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;