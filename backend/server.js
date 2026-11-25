const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    "http://localhost:5173",
    "http://localhost:5174"
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (e.g. mobile apps or curl)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("CORS blocked origin: " + origin));
        },
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

// Admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

// 404 route (Always last)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error);
    }
};

startServer();
