const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile,
  getAllUsers,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", authMiddleware, updateProfile);
router.get("/users", authMiddleware, getAllUsers);

module.exports = router;