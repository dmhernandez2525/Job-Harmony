import { combineReducers } from 'redux';
import users from './users_reducer';
import onePages from './onePages_reducer';
import resumes from './resumes_reducer';
import likes from './likes_reducer';
import preferences from './preferences_reducer';

const entitiesReducer = combineReducers({
  users,
  resumes,
  onePages,
  likes,
  preferences
});

export default entitiesReducer;
