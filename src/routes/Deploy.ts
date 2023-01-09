import { promisify } from 'util';
import { exec } from 'child_process';
import pm2 from 'pm2';
import crypto from 'crypto';
import { Post } from '../decorators';

const execSync = promisify(exec);

export default class Deploy {
  /**
   *
   */
  @Post('/deploy')
  private static async deploy(req: any, res: any) {
    // Check if a raw body exists
    if (!req.rawBody) return res.status(400).json({ error: 'invalid body' });

    // Get request signature
    const sig = Buffer.from(req.get('X-Hub-Signature-256') || '', 'utf8');
    // Create digest from request body
    const hmac = crypto.createHmac('sha256', process.env.DEPLOY_SECRET);
    const digest = Buffer.from('sha256=' + hmac.update(req.rawBody).digest('hex'), 'utf8');

    // Compare generated digest to the request signature
    if (sig.length !== digest.length || !crypto.timingSafeEqual(sig, digest))
      return res.status(401).json({ error: 'invalid token' });

    // Execute git pull
    try {
      if (process.env.NODE_ENV === 'production') await execSync(`sh scripts/production.sh`);
      else if (process.env.NODE_ENV === 'development') await execSync(`sh scripts/development.sh`);

      // Restart the PM2 process
      pm2.connect(err => {
        if (err) throw (err);

        pm2.restart(process.env.pm_id, err1 => {
          if (err1) throw (err1);
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