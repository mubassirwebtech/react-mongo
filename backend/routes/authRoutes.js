const express = require("express");

const router = express.Router();

const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;