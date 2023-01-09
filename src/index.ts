import dotenv from 'dotenv';
import { RouteController } from './controllers';

// Initialize environment variables
dotenv.config();

// Initialize app
import './app';

// Initialize middleware
import './middleware';

// Initialize routes
import './routes';

// Build app
RouteController.deploy();
