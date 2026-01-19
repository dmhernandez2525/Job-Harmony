import { UnknownAction } from '@reduxjs/toolkit';
import {
  RECEIVE_CURRENT_USER,
  RECEIVE_USER_LOGOUT,
  RECEIVE_USER_SIGN_IN,
  RECEIVE_SESSION_ERRORS
} from '../actions/session_actions';
import { RECEIVE_PREFERENCES } from '../actions/preferences_actions';
import { RECEIVE_RESUME } from '../actions/resume_actions';
import { RECEIVE_ONEPAGE } from '../actions/onePage_actions';
import { OnePage, Preference } from '../types';

// Use a more flexible interface for the session state
export interface SessionUser {
  id?: string;
  email?: string;
  fName?: string;
  lName?: string;
  role?: 'employer' | 'employee';
  zipCode?: string;
  date?: string;
  resume?: unknown[];
  preference?: Preference;
  pendingOnePages?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface SessionState {
  isAuthenticated: boolean;
  isSignedIn?: boolean;
  user: SessionUser;
  onePage?: OnePage;
}

const initialState: SessionState = {
  isAuthenticated: false,
  user: {}
};

export default function sessionReducer(
  state: SessionState = initialState,
  action: UnknownAction
): SessionState {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!(action as unknown as { currentUser?: SessionUser }).currentUser,
        user: (action as unknown as { currentUser: SessionUser }).currentUser
      };
    case RECEIVE_USER_LOGOUT:
      return {
        isAuthenticated: false,
        user: {}
      };
    case RECEIVE_USER_SIGN_IN:
      return {
        ...state,
        isSignedIn: true
      };
    case RECEIVE_RESUME:
      return {
        ...state,
        user: {
          ...state.user,
          preference: (action as unknown as { preference?: Preference }).preference
        }
      };
    case RECEIVE_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preference: (action as unknown as { preference: Preference }).preference
        }
      };
    case RECEIVE_ONEPAGE:
      return { ...state, onePage: (action as unknown as { onePage: OnePage }).onePage };
    default:
      return state;
  }
}
