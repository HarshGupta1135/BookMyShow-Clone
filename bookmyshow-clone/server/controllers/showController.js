const Show = require("../models/Show");

// Add Show
exports.addShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Shows By Movie & City
exports.getShows = async (req, res) => {
  try {
    const { movieId, cityId } = req.query;

    const shows = await Show.find({ movie: movieId })
      .populate({
        path: "theater",
        match: { city: cityId },
        populate: { path: "city" },
      })
      .populate("movie");

    const filteredShows = shows.filter(show => show.theater !== null);

    res.json(filteredShows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single show by ID
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie")
      .populate({
        path: "theater",
        populate: { path: "city" },
      });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};