import { KeysConfig } from '../types';

const keys: KeysConfig = {
  mongoURI: process.env.MONGO_URI || 'MONGODB_URI_REDACTED/test?retryWrites=true&w=majority',
  secretOrKey: process.env.SECRET_OR_KEY || 'REDACTED_SECRET'
};

export default keys;
