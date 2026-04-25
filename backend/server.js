const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/borrow", require("./routes/borrowRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.get("/", (req, res) => {
  res.send("Library Management API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});