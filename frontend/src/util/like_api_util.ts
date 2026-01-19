import axios, { AxiosResponse } from 'axios';
import { Like } from '../types';

export const fetchLike = (onePageId: string): Promise<AxiosResponse<Like>> => {
  return axios.get(`/api/likes/${onePageId}`);
};

export const createLike = (like: { OnepageId: string }): Promise<AxiosResponse<Like>> => {
  return axios.post(`/api/likes/${like.OnepageId}`);
};

export const fetchLikes = (): Promise<AxiosResponse<Record<string, Like>>> => {
  return axios.patch(`/api/likes/all/`);
};
