const express = require("express");
const router = express.Router();
const {
  issueBook,
  returnBook,
  getMyBorrows,
  getAllBorrows
} = require("../controllers/borrowController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

router.post("/issue", authMiddleware, issueBook);
router.put("/return/:id", authMiddleware, returnBook);
router.get("/my", authMiddleware, getMyBorrows);
router.get("/", authMiddleware, authorizeRoles("admin"), getAllBorrows);

module.exports = router;