const express = require("express");
const router = express.Router();

const Notification = require("../models/notificationModel");
const authMiddleware = require("../middleware/authMiddleware");

// 🔔 GET USER NOTIFICATIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// 🔔 MARK ALL AS READ
router.put("/read", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

module.exports = router;