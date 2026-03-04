const express = require("express");
const { addTheater, getTheatersByCity } = require("../controllers/theaterController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, addTheater);
router.get("/city/:cityId", getTheatersByCity);

module.exports = router;