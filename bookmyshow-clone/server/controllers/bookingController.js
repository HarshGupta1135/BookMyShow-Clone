const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, totalPrice } = req.body;

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice,
    });

    res.status(201).json({
      message: "Booking successful 🎉",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};