import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IMatch extends Document {
  _id: Types.ObjectId;
  employerId: string;
  resumeId: string;
  date: Date;
}

const MatchSchema: Schema = new Schema({
  employerId: {
    type: String,
    required: true
  },
  resumeId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Match: Model<IMatch> = mongoose.model<IMatch>('matches', MatchSchema);

export default Match;
