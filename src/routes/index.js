const fs = require('fs');
const bodyParser = require('body-parser');

module.exports = (app) => {
  // Saves a valid JSON body to req.rawBody
  app.use(bodyParser.json({
    verify: (req, res, buf, enc) => {
      if (buf && buf.length) req.rawBody = buf.toString(enc, 'utf8');
    }
  }));

  // Load all routes
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    if (!file.endsWith('.js')) return;
  
    // Load route
    let route = require(`./${file}`);
    
    // Register route
    if (route.method.includes('GET')) {
      app.get(route.path, route.handler);
    }
    if (route.method.includes('POST')) {
      app.post(route.path, route.handler);
    }
  });
}