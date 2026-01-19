import { KeysConfig } from '../types';

let keys: KeysConfig;

if (process.env.NODE_ENV === 'production') {
  keys = require('./keys_prod').default;
} else {
  // In development, check for keys_dev or use environment variables
  try {
    keys = require('./keys_dev').default;
  } catch {
    keys = {
      mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/job_harmony',
      secretOrKey: process.env.SECRET_OR_KEY || 'development_secret'
    };
  }
}

export default keys;
