import axios, { AxiosResponse } from 'axios';
import { OnePage, OnePageFormData } from '../types';

export const fetchOnePage = (id: string): Promise<AxiosResponse<OnePage>> => {
  return axios.get(`/api/onePages/${id}`);
};

export const fetchAllOnePages = (): Promise<AxiosResponse<Record<string, OnePage>>> => {
  return axios.get('/api/onePages/all');
};

export const fetchRelevantOnePages = (): Promise<AxiosResponse<Record<string, OnePage>>> => {
  return axios.get('/api/matchers/');
};

export const createOnePage = (onePage: OnePageFormData): Promise<AxiosResponse<OnePage>> => {
  return axios.post('/api/onePages/new', onePage);
};

export const updateOnePage = (onePage: OnePageFormData): Promise<AxiosResponse<OnePage>> => {
  return axios.patch(`/api/onePages/${onePage._id}/edit`, onePage);
};
