const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const Notification = require("../models/notificationModel");

// 🔹 ISSUE BOOK
const issueBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    if (!bookId || !dueDate) {
      return res.status(400).json({ message: "Book ID and due date are required" });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies available" });
    }

    const activeBorrow = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: "issued"
    });

    if (activeBorrow) {
      return res.status(400).json({
        message: "You already borrowed this book and have not returned it"
      });
    }

    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      dueDate
    });

    // update stock
    book.availableCopies -= 1;
    await book.save();

    // 🔔 CREATE NOTIFICATION
    await Notification.create({
      user: req.user._id,
      title: "Book Issued",
      message: `You borrowed ${book.title}`
    });

    res.status(201).json({
      message: "Book issued successfully",
      borrow
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to issue book",
      error: error.message
    });
  }
};

// 🔹 RETURN BOOK
const returnBook = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id).populate("book");

    if (!borrow) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (borrow.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    borrow.returnDate = new Date();
    borrow.status = "returned";

    const dueDate = new Date(borrow.dueDate);
    const returnDate = new Date(borrow.returnDate);

    let fine = 0;

    if (returnDate > dueDate) {
      const diffTime = returnDate - dueDate;
      const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = lateDays * 10;
    }

    borrow.fine = fine;
    await borrow.save();

    // update stock
    const book = await Book.findById(borrow.book._id);
    book.availableCopies += 1;
    await book.save();

    // 🔔 NOTIFICATION
    await Notification.create({
      user: borrow.user,
      title: "Book Returned",
      message: `You returned ${book.title}`
    });

    res.status(200).json({
      message: "Book returned successfully",
      fine: borrow.fine,
      borrow
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to return book",
      error: error.message
    });
  }
};

// 🔹 MY BORROWS
const getMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user._id })
      .populate("book", "title author category isbn")
      .sort({ createdAt: -1 });

    res.status(200).json(borrows);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch borrow history",
      error: error.message
    });
  }
};

// 🔹 ALL BORROWS (ADMIN)
const getAllBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find()
      .populate("user", "name email")
      .populate("book", "title author isbn")
      .sort({ createdAt: -1 });

    res.status(200).json(borrows);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all borrow records",
      error: error.message
    });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getMyBorrows,
  getAllBorrows
};