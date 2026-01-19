import { UnknownAction } from '@reduxjs/toolkit';
import {
  RECEIVE_SESSION_ERRORS,
  RECEIVE_CURRENT_USER
} from '../actions/session_actions';
import {
  RECEIVE_PREFERENCES_ERRORS
} from '../actions/preferences_actions';
import { SessionErrors } from '../types';

const nullErrors: SessionErrors = {};

const SessionErrorsReducer = (
  state: SessionErrors = nullErrors,
  action: UnknownAction
): SessionErrors => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      return (action as unknown as { errors: SessionErrors }).errors;
    case RECEIVE_PREFERENCES_ERRORS:
      return (action as unknown as { errors: SessionErrors }).errors;
    case RECEIVE_CURRENT_USER:
      return nullErrors;
    default:
      return state;
  }
};

export default SessionErrorsReducer;
