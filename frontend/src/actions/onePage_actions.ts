import * as onePageAPIUtil from '../util/onePage_api_util';
import { Dispatch } from 'redux';
import { OnePage, OnePageFormData } from '../types';
import { AxiosResponse } from 'axios';

// Action Types
export const RECEIVE_NEW_MAIN = 'RECEIVE_NEW_MAIN' as const;
export const RECEIVE_ONEPAGE = 'RECEIVE_ONEPAGE' as const;
export const RECEIVE_ALL_ONEPAGES = 'RECEIVE_ALL_ONEPAGES' as const;
export const RECEIVE_ONEPAGE_ERRORS = 'RECEIVE_ONEPAGE_ERRORS' as const;

// Action Interfaces
export interface ReceiveNewMainAction {
  type: typeof RECEIVE_NEW_MAIN;
  onePage: OnePage;
}

export interface ReceiveOnePageAction {
  type: typeof RECEIVE_ONEPAGE;
  onePage: OnePage;
}

export interface ReceiveAllOnePagesAction {
  type: typeof RECEIVE_ALL_ONEPAGES;
  onePages: Record<string, OnePage>;
}

export interface ReceiveOnePageErrorsAction {
  type: typeof RECEIVE_ONEPAGE_ERRORS;
  errors: string[];
}

export type OnePageAction =
  | ReceiveNewMainAction
  | ReceiveOnePageAction
  | ReceiveAllOnePagesAction
  | ReceiveOnePageErrorsAction;

// Action Creators
export const receiveNewMain = (onePage: OnePage): ReceiveNewMainAction => {
  return {
    type: RECEIVE_NEW_MAIN,
    onePage
  };
};

const receiveOnePage = (onePage: AxiosResponse<OnePage>): ReceiveOnePageAction => ({
  type: RECEIVE_ONEPAGE,
  onePage: onePage.data
});

const receiveAllOnePages = (onePages: AxiosResponse<Record<string, OnePage>>): ReceiveAllOnePagesAction => {
  return {
    type: RECEIVE_ALL_ONEPAGES,
    onePages: onePages.data
  };
};

const receiveOnePageErrors = (errors: string[]): ReceiveOnePageErrorsAction => ({
  type: RECEIVE_ONEPAGE_ERRORS,
  errors
});

// Thunk Actions
export const fetchOnePage = (id: string) => (dispatch: Dispatch<OnePageAction>) => (
  onePageAPIUtil.fetchOnePage(id)
    .then(onePage => dispatch(receiveOnePage(onePage)))
);

export const fetchAllOnePages = () => (dispatch: Dispatch<OnePageAction>) => (
  onePageAPIUtil.fetchAllOnePages()
    .then(onePages => dispatch(receiveAllOnePages(onePages)))
);

export const fetchRelevantOnePages = () => (dispatch: Dispatch<OnePageAction>) => (
  onePageAPIUtil.fetchRelevantOnePages()
    .then(onePages => dispatch(receiveAllOnePages(onePages)))
);

export const createOnePage = (onePage: OnePageFormData) => (dispatch: Dispatch<OnePageAction>) => (
  onePageAPIUtil.createOnePage(onePage)
    .then(onePage => dispatch(receiveOnePage(onePage)))
    .catch(err => dispatch(receiveOnePageErrors(err.response.data)))
);

export const updateOnePage = (onePage: OnePageFormData) => (dispatch: Dispatch<OnePageAction>) => {
  return onePageAPIUtil.updateOnePage(onePage)
    .then(onePage => dispatch(receiveOnePage(onePage)))
    .catch(err => dispatch(receiveOnePageErrors(err.response.data)));
};
