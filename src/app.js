const mongoose = require('mongoose');
const express = require('express');
const app = express();

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOOSE_URI, (err) => {
  if (err) console.error(err);
});

// Load routes
require('./routes/index')(app);

// Express server port
const port = process.env.PORT || 3000;

// Make express server listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;