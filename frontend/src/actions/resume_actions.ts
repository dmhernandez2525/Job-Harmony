import * as ResumeAPIUtil from '../util/resume_api_util';
import { Dispatch } from 'redux';
import { Resume, ResumeFormData } from '../types';
import { AxiosResponse } from 'axios';

// Action Types
export const RECEIVE_RESUME = 'RECEIVE_RESUME' as const;
export const RECEIVE_RESUME_ERRORS = 'RECEIVE_RESUME_ERRORS' as const;

// Action Interfaces
export interface ReceiveResumeAction {
  type: typeof RECEIVE_RESUME;
  resume: Resume;
}

export interface ReceiveResumeErrorsAction {
  type: typeof RECEIVE_RESUME_ERRORS;
  errors: string[];
}

export type ResumeAction = ReceiveResumeAction | ReceiveResumeErrorsAction;

// Action Creators
const receiveResume = (resume: AxiosResponse<Resume>): ReceiveResumeAction => ({
  type: RECEIVE_RESUME,
  resume: resume.data
});

const receiveResumeErrors = (errors: string[]): ReceiveResumeErrorsAction => ({
  type: RECEIVE_RESUME_ERRORS,
  errors
});

// Thunk Actions
export const fetchResume = (userId: string) => (dispatch: Dispatch<ResumeAction>) => (
  ResumeAPIUtil.fetchResume(userId)
    .then(resume => dispatch(receiveResume(resume)))
    .catch(err => dispatch(receiveResumeErrors(err.response.data)))
);

export const createResume = (resume: ResumeFormData) => (dispatch: Dispatch<ResumeAction>) => (
  ResumeAPIUtil.createResume(resume)
    .then(resume => dispatch(receiveResume(resume)))
    .catch(err => dispatch(receiveResumeErrors(err.response.data)))
);

export const updateResume = (resume: ResumeFormData) => (dispatch: Dispatch<ResumeAction>) => (
  ResumeAPIUtil.updateResume(resume)
    .then(resume => dispatch(receiveResume(resume)))
    .catch(err => dispatch(receiveResumeErrors(err.response.data)))
);
