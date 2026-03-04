const express = require("express");
const { addCity, getCities } = require("../controllers/cityController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, addCity);
router.get("/", getCities);

module.exports = router;