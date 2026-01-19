import axios, { AxiosResponse } from 'axios';
import { Resume, ResumeFormData } from '../types';

export const fetchResume = (id: string): Promise<AxiosResponse<Resume>> => {
  return axios.get(`/api/resumes/${id}`);
};

export const createResume = (resume: ResumeFormData): Promise<AxiosResponse<Resume>> => {
  return axios.post('/api/resumes/new', resume);
};

export const updateResume = (resume: ResumeFormData): Promise<AxiosResponse<Resume>> => {
  return axios.patch(`/api/resumes/${resume._id}/edit`, resume);
};
