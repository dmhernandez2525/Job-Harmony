import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_NEW_MAIN } from '../actions/onePage_actions';
import { OnePage } from '../types';

export interface CurrentMainState {
  currentMain: OnePage | null;
}

const initialState: CurrentMainState = { currentMain: null };

export default function currentMainReducer(
  state: CurrentMainState = initialState,
  action: UnknownAction
): CurrentMainState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_NEW_MAIN:
      return { ...state, currentMain: (action as unknown as { onePage: OnePage }).onePage };
    default:
      return state;
  }
}
