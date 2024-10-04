const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.DB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error', err));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Defining API endpoints and their corresponding handlers
app.get('/', routes.landing);
app.get('/random', routes.random);
app.get('/recipes/:recipe_id', routes.recipe);
app.get('/ingredient/:ingredient_id', routes.ingredient_name); // Route 1
app.get('/ingredients/:ingredient_id', routes.ingredient_recipes); // Route 2
app.get('/search_recipes', routes.search_recipes); // Route 3
app.get('/recipe_ingredients/:recipe_id', routes.recipe_ingredients); // Route 4
app.get('/easy', routes.easy); // Route 5
app.get('/top_recipes', routes.top_recipes); // Route 6
app.get('/top_ingredients', routes.top_ingredients); // Route 7
app.get('/contributors', routes.contributors); // Route 8
app.get('/top_ingredient_pairs', routes.top_ingredient_pairs); // Route 9
app.get('/detailed_metrics', routes.detailed_metrics); // Route 10
app.get('/rare_ingredients', routes.rare_ingredients); // Route 11
app.get('/data', routes.data); // Route 12
app.get('/contributor/:contributor_id', routes.contributordetails);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
