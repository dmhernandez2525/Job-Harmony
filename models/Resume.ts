import mongoose, { Schema, Model } from 'mongoose';
import { IResume } from '../types';

const ResumeSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  jobHistory: {
    type: String,
    required: true
  },
  jobField: {
    type: String,
    required: true
  },
  jobSkills: {
    type: String,
    required: true
  }
});

const Resume: Model<IResume> = mongoose.model<IResume>('resumes', ResumeSchema);

export default Resume;
