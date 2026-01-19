import axios, { AxiosResponse } from 'axios';
import { LoginCredentials, SignupCredentials, AuthResponse } from '../types';

export const setAuthToken = (token: string | false): void => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const signup = (userData: SignupCredentials): Promise<AxiosResponse<AuthResponse>> => {
  return axios.post('/api/users/register', userData);
};

export const login = (userData: LoginCredentials): Promise<AxiosResponse<AuthResponse>> => {
  return axios.post('/api/users/login', userData);
};
