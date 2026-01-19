import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_RESUME_ERRORS } from '../actions/resume_actions';

export type ResumeErrorsState = string[];

export default function resumeErrorsReducer(
  state: ResumeErrorsState = [],
  action: UnknownAction
): ResumeErrorsState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_RESUME_ERRORS:
      return (action as unknown as { errors: string[] }).errors;
    default:
      return state;
  }
}
