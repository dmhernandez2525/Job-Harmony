import express, { Application, Request, Response } from 'express';
import passport from 'passport';
import path from 'path';

import configurePassport from './config/passport';
import { connectToMongoDB, getDatabaseHealth } from './utils/database';

// Import Models first (to register them)
import './models/User';
import './models/Resume';
import './models/OnePage';
import './models/Preference';
import './models/Like';
import './models/Match';
import './models/PurchaseOrder';

// Import Routes
import users from './routes/api/users';
import resumes from './routes/api/resumes';
import purchaseOrders from './routes/api/purchaseOrders';
import quickbooks from './routes/api/quickbooks';

// For backward compatibility, keep JS routes working
const likes = require('./routes/api/likes');
const preferences = require('./routes/api/preferences');
const matches = require('./routes/api/matches');
const seeds = require('./routes/api/seeds');
const matchers = require('./routes/api/matchers');
const onePages = require('./routes/api/onePages');

const app: Application = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Use Express built-in middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MongoDB (graceful - server continues if connection fails)
connectToMongoDB();

app.use(passport.initialize());
configurePassport(passport);

// Health check endpoint for Render
app.get('/api/health', (req: Request, res: Response) => {
  const dbHealth = getDatabaseHealth();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

const port = process.env.PORT || 5000;

// Routes
app.use('/api/resumes', resumes);
app.use('/api/preferences', preferences);
app.use('/api/onePages', onePages);
app.use('/api/users', users);
app.use('/api/matches', matches);
app.use('/api/likes', likes);
app.use('/api/matchers', matchers);
app.use('/api/seeds', seeds);
app.use('/api/purchase-orders', purchaseOrders);
app.use('/api/quickbooks', quickbooks);
app.use(express.static('public'));

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default app;
