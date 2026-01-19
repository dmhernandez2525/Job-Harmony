import { UnknownAction } from '@reduxjs/toolkit';
import { OPEN_MODAL, CLOSE_MODAL } from '../actions/modal_actions';
import { ModalType } from '../types';

export default function modalReducer(
  state: ModalType = null,
  action: UnknownAction
): ModalType {
  switch (action.type) {
    case OPEN_MODAL:
      return (action as unknown as { modal: ModalType }).modal;
    case CLOSE_MODAL:
      return null;
    default:
      return state;
  }
}
