module.exports = {
  // Creates a valid JSON string under req.rawBody
  handler: (req, res, next) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  }
}