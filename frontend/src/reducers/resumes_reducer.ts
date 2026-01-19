import { UnknownAction } from '@reduxjs/toolkit';
import { RECEIVE_RESUME } from '../actions/resume_actions';
import { Resume } from '../types';

export type ResumesState = Record<string, Resume>;

export default function resumesReducer(
  state: ResumesState = {},
  action: UnknownAction
): ResumesState {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_RESUME:
      const resume = (action as unknown as { resume: Resume }).resume;
      return { [resume._id]: resume };
    default:
      return state;
  }
}
