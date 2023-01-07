const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const pm2 = require('pm2');
const crypto = require('crypto');

module.exports = {
  method: 'POST',
  path: '/deploy',
  middleware: [],
  handler: async (req, res) => {
    // Check if a raw body exists
    if (!req.rawBody) return res.status(400).json({ error: 'invalid body' });
    
    // Get request signature
    const sig = Buffer.from(req.get('X-Hub-Signature-256') || '', 'utf8');
    // Create digest from request body
    const hmac = crypto.createHmac('sha256', process.env.DEPLOY_SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(req.rawBody).digest('hex'), 'utf8');

    // Compare generated digest to the request signature
    if (sig.length != digest.length || !crypto.timingSafeEqual(sig, digest))
      return res.status(401).json({ error: 'invalid token' });

    // Execute git pull
    try {
      let { stdout, stderr } = await exec('git pull');
      if (stdout) console.log(stdout);
      if (stderr) {
        console.log(stderr);
        return res.status(500).json({ error: 'git pull failed' });
      }

      // Restart the PM2 process
      pm2.connect(err => {
        if (err) throw (err);

        pm2.restart(process.env.pm_id, err => {
          if (err) throw (err);
        });
      });

      // Return success status
      return res.status(200).json({ success: 'changes applied' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'git pull failed' });
    }
  }
}