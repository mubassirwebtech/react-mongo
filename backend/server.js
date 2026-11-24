const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// MongoDB connection
connectDB();

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "React Mongo Auth API is running"
    });
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// 404 route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});