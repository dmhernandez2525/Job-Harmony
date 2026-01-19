import * as PreferenceAPIUtil from '../util/preferences_api_util';
import { Dispatch } from 'redux';
import { Preference, PreferenceFormData } from '../types';
import { AxiosResponse } from 'axios';

// Action Types
export const RECEIVE_PREFERENCES = 'RECEIVE_PREFERENCES' as const;
export const RECEIVE_PREFERENCES_ERRORS = 'RECEIVE_PREFERENCES_ERRORS' as const;

// Action Interfaces
export interface ReceivePreferencesAction {
  type: typeof RECEIVE_PREFERENCES;
  preference: Preference;
}

export interface ReceivePreferencesErrorsAction {
  type: typeof RECEIVE_PREFERENCES_ERRORS;
  errors: string[];
}

export type PreferencesAction = ReceivePreferencesAction | ReceivePreferencesErrorsAction;

// Action Creators
const receivePreference = (preference: AxiosResponse<Preference>): ReceivePreferencesAction => ({
  type: RECEIVE_PREFERENCES,
  preference: preference.data
});

const receivePreferenceErrors = (errors: string[]): ReceivePreferencesErrorsAction => ({
  type: RECEIVE_PREFERENCES_ERRORS,
  errors
});

// Thunk Actions
export const createPreference = (preference: PreferenceFormData) => (dispatch: Dispatch<PreferencesAction>) => {
  return PreferenceAPIUtil.createPreference(preference)
    .then(preference => dispatch(receivePreference(preference)))
    .catch(err => dispatch(receivePreferenceErrors(err.response.data)));
};

export const fetchPreference = (id: string) => (dispatch: Dispatch<PreferencesAction>) => {
  return PreferenceAPIUtil.fetchPreference(id)
    .then(preference => dispatch(receivePreference(preference)))
    .catch(err => dispatch(receivePreferenceErrors(err.response.data)));
};

export const updatePreference = (preference: PreferenceFormData) => (dispatch: Dispatch<PreferencesAction>) => {
  return PreferenceAPIUtil.updatePreference(preference)
    .then(preference => dispatch(receivePreference(preference)))
    .catch(err => dispatch(receivePreferenceErrors(err.response.data)));
};
