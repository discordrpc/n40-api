const { exec } = require('child_process');
const pm2 = require('pm2');
const crypto = require('crypto');

module.exports = {
  method: 'POST',
  path: '/deploy',
  handler: (req, res) => {
    // Get request signature
    const sig = Buffer.from(req.get('X-Hub-Signature-256') || '', 'utf8');
    // Create digest from request body
    const hmac = crypto.createHmac('sha256', process.env.DEPLOY_SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex'), 'utf8');

    // Compare generated digest to the request signature
    if (sig.length != digest.length || crypto.timingSafeEqual(sig, digest))
      return res.status(400).json({ error: 'invalid token' });

    // Execute git pull
    exec('git pull', (err, _, stderr) => {
      if (err || stderr) {
        console.log(err || stderr);
        res.status(500).json({ error: 'failed to pull' });
      }

      // Restart the server
      pm2.connect((err) => {
        if (err) throw err;

        pm2.restart('HTTP-API', (err) => {
          if (err) throw err;
        });
      });
    });

    // Send success response
    res.status(200).json({ success: 'deployed' });
  }
}