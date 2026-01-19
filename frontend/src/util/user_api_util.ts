import axios, { AxiosResponse } from 'axios';
import { User } from '../types';

export const fetchUsers = (): Promise<AxiosResponse<User[]>> => {
  return axios.get('/api/users/all');
};

export const fetchUser = (id: string): Promise<AxiosResponse<User>> => {
  return axios.get(`/api/users/${id}`);
};
