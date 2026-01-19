import * as APIUtil from '../util/session_api_util';
import { jwtDecode } from 'jwt-decode';
import { Dispatch } from 'redux';
import { CurrentUser, LoginCredentials, SignupCredentials, SessionErrors } from '../types';

// Action Types
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER' as const;
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS' as const;
export const RECEIVE_USER_LOGOUT = 'RECEIVE_USER_LOGOUT' as const;
export const RECEIVE_USER_SIGN_IN = 'RECEIVE_USER_SIGN_IN' as const;

// Action Interfaces
export interface ReceiveCurrentUserAction {
  type: typeof RECEIVE_CURRENT_USER;
  currentUser: CurrentUser;
}

export interface ReceiveUserSignInAction {
  type: typeof RECEIVE_USER_SIGN_IN;
}

export interface ReceiveSessionErrorsAction {
  type: typeof RECEIVE_SESSION_ERRORS;
  errors: SessionErrors;
}

export interface LogoutUserAction {
  type: typeof RECEIVE_USER_LOGOUT;
}

export type SessionAction =
  | ReceiveCurrentUserAction
  | ReceiveUserSignInAction
  | ReceiveSessionErrorsAction
  | LogoutUserAction;

// Action Creators
export const receiveCurrentUser = (currentUser: CurrentUser): ReceiveCurrentUserAction => ({
  type: RECEIVE_CURRENT_USER,
  currentUser
});

export const receiveUserSignIn = (): ReceiveUserSignInAction => ({
  type: RECEIVE_USER_SIGN_IN
});

export const receiveErrors = (errors: SessionErrors): ReceiveSessionErrorsAction => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const logoutUser = (): LogoutUserAction => ({
  type: RECEIVE_USER_LOGOUT
});

// Thunk Actions
export const signup = (user: SignupCredentials) => (dispatch: Dispatch<SessionAction>) => {
  return APIUtil.signup(user)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      APIUtil.setAuthToken(token);
      const decoded = jwtDecode<CurrentUser>(token);
      dispatch(receiveUserSignIn());
      dispatch(receiveCurrentUser(decoded));
    })
    .catch(err => {
      dispatch(receiveErrors(err.response.data));
    });
};

export const login = (user: LoginCredentials) => (dispatch: Dispatch<SessionAction>) => (
  APIUtil.login(user)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      APIUtil.setAuthToken(token);
      const decoded = jwtDecode<CurrentUser>(token);
      dispatch(receiveCurrentUser(decoded));
    })
    .catch(err => {
      dispatch(receiveErrors(err.response.data));
    })
);

export const logout = () => (dispatch: Dispatch<LogoutUserAction>) => {
  localStorage.removeItem('jwtToken');
  APIUtil.setAuthToken(false);
  dispatch(logoutUser());
};
