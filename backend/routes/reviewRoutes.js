const express = require("express");
const router = express.Router();
const Review = require("../models/reviewModel");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  const { bookId, rating, comment } = req.body;

  const review = new Review({
    user: req.user._id,
    book: bookId,
    rating,
    comment,
  });

  await review.save();
  res.json(review);
});

router.get("/:bookId", async (req, res) => {
  const reviews = await Review.find({ book: req.params.bookId })
    .populate("user", "name");

  res.json(reviews);
});

module.exports = router;