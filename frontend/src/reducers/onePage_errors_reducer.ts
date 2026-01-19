import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_ONEPAGE_ERRORS } from '../actions/onePage_actions';

export type OnePageErrorsState = string[];

export default function onePageErrorsReducer(
  state: OnePageErrorsState = [],
  action: UnknownAction
): OnePageErrorsState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_ONEPAGE_ERRORS:
      return (action as unknown as { errors: string[] }).errors;
    default:
      return state;
  }
}
