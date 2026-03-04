const express = require("express");
const { addShow, getShows, getShowById } = require("../controllers/showController");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, admin, addShow);
router.get("/", getShows);
router.get("/:id", getShowById);
module.exports = router;