const Theater = require("../models/Theater");

// Add Theater
exports.addTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json(theater);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Theaters By City
exports.getTheatersByCity = async (req, res) => {
  try {
    const theaters = await Theater.find({ city: req.params.cityId });
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};