import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/root_reducer';

const createStore = (preloadedState = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    devTools: import.meta.env.MODE !== 'production',
  });

export default createStore;
