import { KeysConfig } from '../types';

if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is required');
}

if (!process.env.SECRET_OR_KEY) {
  throw new Error('SECRET_OR_KEY environment variable is required');
}

const keys: KeysConfig = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY
};

export default keys;
