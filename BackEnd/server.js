const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 8080;

const apiKey = '8d595551f86c5ed63a30f17469f09f1a';
const baseUrl = 'https://api.themoviedb.org/3';

app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'dist', 'movie-app', 'browser')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'FrontEnd', 'dist', 'movie-app', 'browser', 'index.html'));
});


app.get('/api/movies/popular', async (req, res) => {
  const page = req.query.page; 
  try {
    const response = await axios.get(`${baseUrl}/movie/popular`, {
      params: {
        api_key: apiKey,
        page: page,
      },
    });
    res.json(response.data.results); 
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).send({ error: 'Failed to fetch popular movies' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  const movieId = req.params.id; 
  try {
    const response = await axios.get(`${baseUrl}/movie/${movieId}`, {
      params: {
        api_key: apiKey,
        append_to_response: 'credits', 
      },
    });
    res.json(response.data); 
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).send({ error: 'Failed to fetch movie details' });
  }
});


app.post('/api/movies', (req, res) => {
  const newMovie = req.body;
  res.send({ message: 'Movie added', data: newMovie });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
