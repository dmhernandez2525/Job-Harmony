import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_ALL_USERS, RECEIVE_USER } from '../actions/user_actions';
import { User } from '../types';

export type UsersState = Record<string, User>;

export default function usersReducer(
  state: UsersState = {},
  action: UnknownAction
): UsersState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_USERS:
      // Convert array to object keyed by id
      return ((action as unknown as { users: User[] }).users || []).reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as UsersState);
    case RECEIVE_USER:
      return { ...state, [(action as unknown as { user: User }).user.id]: (action as unknown as { user: User }).user };
    default:
      return state;
  }
}
