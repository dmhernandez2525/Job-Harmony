import { KeysConfig } from '../types';

const keys: KeysConfig = {
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://dev:kbYpsWJo72EZj2Kh@cluster0-l03rz.mongodb.net/test?retryWrites=true&w=majority',
  secretOrKey: process.env.SECRET_OR_KEY || 'chasdanlukedon'
};

export default keys;
