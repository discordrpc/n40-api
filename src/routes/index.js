const fs = require('fs');

module.exports = (app) => {
  // Saves a valid JSON body to req.rawBody
  app.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  });

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