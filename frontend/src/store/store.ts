import { legacy_createStore as createReduxStore, applyMiddleware, combineReducers, Store, AnyAction } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import session, { SessionState } from '../reducers/session_reducer';
import errors from '../reducers/errors_reducer';
import ui from '../reducers/ui_reducer';
import entities from '../reducers/entities_reducer';

// Create the root reducer
const rootReducer = combineReducers({
  entities,
  session,
  ui,
  errors,
});

// Infer the RootState type from the rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Create store function
const createStore = (preloadedState: Partial<RootState> = {}): Store<RootState, AnyAction> => {
  return createReduxStore(
    rootReducer,
    preloadedState as RootState,
    applyMiddleware(thunk)
  );
};

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export default createStore;
