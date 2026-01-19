import axios, { AxiosResponse } from 'axios';
import { Preference, PreferenceFormData } from '../types';

export const fetchPreference = (id: string): Promise<AxiosResponse<Preference>> => {
  return axios.get(`/api/preferences/${id}`);
};

export const createPreference = (preference: PreferenceFormData): Promise<AxiosResponse<Preference>> => {
  return axios.post('/api/preferences/new', preference);
};

export const updatePreference = (preference: PreferenceFormData): Promise<AxiosResponse<Preference>> => {
  return axios.patch(`/api/preferences/${preference.id}`, preference);
};
