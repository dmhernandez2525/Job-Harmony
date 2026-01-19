import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_LIKE, RECEIVE_ALL_LIKES } from '../actions/like_actions';
import { RECEIVE_USER_LOGOUT } from '../actions/session_actions';
import { OnePage } from '../types';

export type LikesState = Record<string, OnePage>;

export default function likesReducer(
  state: LikesState = {},
  action: UnknownAction
): LikesState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ALL_LIKES:
      return (action as unknown as { likes: LikesState }).likes;
    case RECEIVE_LIKE:
      const like = action as unknown as { like: { onePageId: string; onePage: OnePage } };
      return { ...state, [like.like.onePageId]: like.like.onePage };
    case RECEIVE_USER_LOGOUT:
      return {};
    default:
      return state;
  }
}
