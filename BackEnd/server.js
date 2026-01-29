const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const { pool, databaseConnection } = require("./config/database");
const routes = require('./routes/authRoutes');

dotenv.config();
databaseConnection();

const app = express();
const port = 8080;

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// API routes
app.use('/api', routes); // /api/login, /api/register

const apiKey = "8d595551f86c5ed63a30f17469f09f1a";
const baseUrl = "https://api.themoviedb.org/3";

// Serve Angular app (production build)
const angularDistPath = path.join(__dirname, "..", "FrontEnd", "dist", "movie-app", "browser"); // <-- updated path to include 'browser' directory
app.use(express.static(angularDistPath));

// Always return index.html for Angular routes
app.get("*", (req, res) => {
  res.sendFile(path.join(angularDistPath, "index.html"));
});

// TMDB endpoints
app.get("/api/movies/popular", async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/movie/popular`, {
      params: { api_key: apiKey, page: req.query.page || 1 },
    });
    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).send({ error: "Failed to fetch popular movies" });
  }
});

app.get("/api/movies/by-release-date", async (req, res) => {
  const { release_date } = req.query;
  if (!release_date) return res.status(400).send({ error: "release_date is required" });

  try {
    const response = await axios.get(`${baseUrl}/movie/popular`, { params: { api_key: apiKey, page: 1 } });
    const filteredMovies = response.data.results.filter(movie => movie.release_date === release_date);
    res.json(filteredMovies);
  } catch (error) {
    console.error("Error fetching movies by release date:", error);
    res.status(500).send({ error: "Failed to fetch movies by release date" });
  }
});

app.get("/api/movies/latest", async (req, res) => {
  const current_date = new Date();
  const formatted_date = current_date.toISOString().split("T")[0];
  const page = req.query.page || 1;

  try {
    const response = await axios.get(`${baseUrl}/discover/movie`, {
      params: { api_key: apiKey, sort_by: "release_date.desc", "primary_release_date.lte": formatted_date, page },
    });
    res.json({
      page: response.data.page,
      total_pages: response.data.total_pages,
      total_results: response.data.total_results,
      results: response.data.results,
    });
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    res.status(500).send({ error: "Failed to fetch latest movies" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${baseUrl}/movie/${movieId}`, {
      params: { api_key: apiKey, append_to_response: "credits" },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).send({ error: "Failed to fetch movie details" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
