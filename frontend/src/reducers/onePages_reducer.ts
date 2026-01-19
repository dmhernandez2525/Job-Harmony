import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_USER_LOGOUT } from '../actions/session_actions';
import { RECEIVE_ONEPAGE, RECEIVE_ALL_ONEPAGES } from '../actions/onePage_actions';
import { OnePage } from '../types';

export type OnePagesState = Record<string, OnePage>;

export default function onePagesReducer(
  state: OnePagesState = {},
  action: UnknownAction
): OnePagesState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_ONEPAGES:
      return { ...(action as unknown as { onePages: Record<string, OnePage> }).onePages };
    case RECEIVE_ONEPAGE:
      const onePage = (action as unknown as { onePage: OnePage }).onePage;
      return { [onePage._id]: onePage };
    case RECEIVE_USER_LOGOUT:
      return {};
    default:
      return state;
  }
}
