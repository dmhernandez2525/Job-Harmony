import { ModalType } from '../types';

// Action Types
export const OPEN_MODAL = 'OPEN_MODAL' as const;
export const CLOSE_MODAL = 'CLOSE_MODAL' as const;

// Action Interfaces
export interface OpenModalAction {
  type: typeof OPEN_MODAL;
  modal: ModalType;
}

export interface CloseModalAction {
  type: typeof CLOSE_MODAL;
}

export type ModalAction = OpenModalAction | CloseModalAction;

// Action Creators
export const openModal = (modal: ModalType): OpenModalAction => {
  return {
    type: OPEN_MODAL,
    modal
  };
};

export const closeModal = (): CloseModalAction => {
  return {
    type: CLOSE_MODAL
  };
};
