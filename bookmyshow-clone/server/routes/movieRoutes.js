const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { addMovie, getMovies, getMovieById, deleteMovieById, updateMovieById  } = require("../controllers/movieController");

const router = express.Router();

// Admin only
router.post("/", protect, admin, addMovie);

router.delete("/:id", protect, admin, deleteMovieById);

router.put("/:id", protect, admin, updateMovieById);

// Public
router.get("/", getMovies);

router.get("/:id", getMovieById);


module.exports = router;