import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface ILike extends Document {
  _id: Types.ObjectId;
  employeeId: number;
  OnepageId: number;
  date: Date;
}

const LikeSchema: Schema = new Schema({
  employeeId: {
    type: Number,
    required: true
  },
  OnepageId: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Like: Model<ILike> = mongoose.model<ILike>('likes', LikeSchema);

export default Like;
