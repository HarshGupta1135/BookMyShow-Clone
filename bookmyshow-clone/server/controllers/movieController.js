const Movie = require("../models/Movie");

// 🎬 Add Movie
exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎬 Get All Movies
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎬 Get Single Movie
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete Movie by ID (Admin only)
exports.deleteMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await movie.deleteOne();

    res.json({ message: "Movie deleted successfully 🎬" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Movie by ID (Admin only)
exports.updateMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    movie.language = req.body.language || movie.language;
    movie.genre = req.body.genre || movie.genre;
    movie.duration = req.body.duration || movie.duration;
    movie.releaseDate = req.body.releaseDate || movie.releaseDate;
    movie.poster = req.body.poster || movie.poster;

    const updatedMovie = await movie.save();

    res.json(updatedMovie);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};