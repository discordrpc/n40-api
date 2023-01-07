const fs = require('fs');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE_URI, (err) => {
  if (err) console.error(err);
});

// Load middleware
const middlewares = new Map();
fs.readdirSync(__dirname + '/middleware').forEach(file => {
  if (!file.endsWith('.js')) return;

  // Load middleware and save it to the map
  let middleware = require(`./middleware/${file}`);
  let name = middleware.name ? middleware.name.toLowerCase() : file.replace('.js', '').toLowerCase();

  middlewares.set(name, middleware.handler);
});

// Load all routes
fs.readdirSync(__dirname + '/routes').forEach(file => {
  if (!file.endsWith('.js')) return;

  // Import route
  let data = require(`./routes/${file}`);
  // Get methods and required middleware
  let methods = data.method.toLowerCase().split(' ');
  let middlewareNames = data.middleware.toLowerCase().split(' ');

  // Register route
  let route = app.route(data.path);

  // Get all middleware required by the route
  let middleware = [];
  middlewareNames.forEach(name => {
    if (!middlewares.has(name)) return;
    middleware.push(middlewares.get(name));
  });

  // Register handler and middlewares to methods
  methods.forEach(method => {
    route[method](...middleware, data.handler);
  });
});

// Get server port
const port = process.env.PORT || 3000;

// Make express server listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;