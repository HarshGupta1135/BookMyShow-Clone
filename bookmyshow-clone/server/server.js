const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/bookmyshow")
.then(() => console.log("MongoDB Connected Successfully ✅"))
  .catch((err) => console.log("MongoDB Connection Error ❌", err));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
const cityRoutes = require("./routes/cityRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");



require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/theaters", theaterRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", require("./routes/userRoutes"));
// Test Route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});


app.get("/test-db", async (req, res) => {
  const testCollection = mongoose.connection.db.collection("test");
  await testCollection.insertOne({ name: "testUser" });
  res.send("Test data inserted");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});