import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IOnePage extends Document {
  _id: Types.ObjectId;
  userId: string;
  companyName: string;
  jobTitle: string;
  description: string;
  type: string;
  remote: boolean;
  benefits: string;
  startingPay: number;
  jobField: string;
  jobSkills: string;
  image?: string;
  catchPhrase?: string;
  resumes: Types.ObjectId[];
}

const OnePageSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  remote: {
    type: Boolean,
    default: false
  },
  benefits: {
    type: String,
    required: true
  },
  startingPay: {
    type: Number,
    required: true
  },
  jobField: {
    type: String,
    required: true
  },
  jobSkills: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  catchPhrase: {
    type: String,
    required: false
  },
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'resumes' }]
});

const OnePage: Model<IOnePage> = mongoose.model<IOnePage>('onePages', OnePageSchema);

export default OnePage;
