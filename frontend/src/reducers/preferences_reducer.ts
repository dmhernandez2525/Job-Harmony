import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_PREFERENCES } from '../actions/preferences_actions';
import { RECEIVE_CURRENT_USER, RECEIVE_USER_LOGOUT } from '../actions/session_actions';
import { Preference, CurrentUser } from '../types';

export type PreferencesState = Preference | Record<string, never>;

export default function preferencesReducer(
  state: PreferencesState = {},
  action: UnknownAction
): PreferencesState {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_PREFERENCES:
      return { ...(action as unknown as { preference: Preference }).preference };
    case RECEIVE_CURRENT_USER:
      const currentUser = (action as unknown as { currentUser: CurrentUser }).currentUser;
      return currentUser.preference ? { ...currentUser.preference } : {};
    case RECEIVE_USER_LOGOUT:
      return {};
    default:
      return state;
  }
}
