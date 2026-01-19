import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IPreference extends Document {
  _id: Types.ObjectId;
  userId: string;
  jobField: string;
  proximity: number;
  type: string;
  salaryRangeHigh: number;
  salaryRangeLow: number;
  remote?: boolean;
}

const PreferenceSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  jobField: {
    type: String,
    required: true
  },
  proximity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  salaryRangeHigh: {
    type: Number,
    required: true
  },
  salaryRangeLow: {
    type: Number,
    required: true
  },
  remote: {
    type: Boolean
  }
});

const Preference: Model<IPreference> = mongoose.model<IPreference>('preferences', PreferenceSchema);

export default Preference;
