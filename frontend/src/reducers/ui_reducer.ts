import { combineReducers } from 'redux';
import modalReducer from './modal_reducer';
import currentMainReducer from './current_main_reducer';

const uiReducer = combineReducers({
  modal: modalReducer,
  currentMain: currentMainReducer
});

export default uiReducer;
