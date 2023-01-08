const { KeyModel } = require('../models');

module.exports = {
  // Verifies the API key provided is valid
  handler: (req, res, next) => {
    // Skip key verification for the deploy route
    if (req.baseUrl == '/deploy') return next();

    // Check if a key was provided
    let { key } = req.query;
    if (!key) return res.status(401).json({ error: 'invalid key' });

    // Check if the key is valid
    KeyModel.findOne({ key: key }, (err, data) => {
      if (err) return res.status(500).json({ error: 'internal server error' });
      if (!data) return res.status(401).json({ error: 'invalid key' });

      // Key is valid, continue
      next();
    });
  }
}