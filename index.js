require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./src/api/index');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, (err) => {
  if (err) console.error(err);
});

// Express server port
const port = process.env.PORT || 3000;

// Make express server listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});