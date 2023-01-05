const fs = require('fs');

module.exports = (app) => {
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