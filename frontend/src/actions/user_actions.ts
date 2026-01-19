import * as UserAPIUtil from '../util/user_api_util';
import { Dispatch } from 'redux';
import { User } from '../types';
import { AxiosResponse } from 'axios';

// Action Types
export const RECEIVE_ALL_USERS = 'RECEIVE_ALL_USERS' as const;
export const RECEIVE_USER = 'RECEIVE_USER' as const;
export const RECEIVE_USER_ERRORS = 'RECEIVE_USER_ERRORS' as const;

// Action Interfaces
export interface ReceiveAllUsersAction {
  type: typeof RECEIVE_ALL_USERS;
  users: User[];
}

export interface ReceiveUserAction {
  type: typeof RECEIVE_USER;
  user: User;
}

export interface ReceiveUserErrorsAction {
  type: typeof RECEIVE_USER_ERRORS;
  errors: Record<string, string>;
}

export type UserAction =
  | ReceiveAllUsersAction
  | ReceiveUserAction
  | ReceiveUserErrorsAction;

// Action Creators
const receiveUsers = (users: AxiosResponse<User[]>): ReceiveAllUsersAction => ({
  type: RECEIVE_ALL_USERS,
  users: users.data
});

const receiveUser = (user: AxiosResponse<User>): ReceiveUserAction => ({
  type: RECEIVE_USER,
  user: user.data
});

const receiveUserErrors = (errors: Record<string, string>): ReceiveUserErrorsAction => ({
  type: RECEIVE_USER_ERRORS,
  errors
});

// Thunk Actions
export const fetchUsers = () => (dispatch: Dispatch<UserAction>) => (
  UserAPIUtil.fetchUsers()
    .then(users => dispatch(receiveUsers(users)))
    .catch(err => dispatch(receiveUserErrors(err.response.data)))
);

export const fetchUser = (id: string) => (dispatch: Dispatch<UserAction>) => (
  UserAPIUtil.fetchUser(id)
    .then(user => dispatch(receiveUser(user)))
    .catch(err => dispatch(receiveUserErrors(err.response.data)))
);
