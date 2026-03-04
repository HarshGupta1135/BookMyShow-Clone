const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    language: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    releaseDate: {
      type: Date,
    },
    poster: {
      type: String, // image URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);