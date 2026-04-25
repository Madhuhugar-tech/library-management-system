const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);