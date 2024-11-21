const express = require('express');
const routes = express.Router();
const {register, login} = require('../Controller/authController');

routes.post('/register', register);

routes.post('/login', login);

module.exports = routes;