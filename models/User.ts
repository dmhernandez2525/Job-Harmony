import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types';

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    required: true
  },
  pendingOnePages: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'onePages' }]
  },
  resume: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resumes' }],
  preference: [{ type: mongoose.Schema.Types.ObjectId, ref: 'preferences' }]
});

const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);

export default User;
