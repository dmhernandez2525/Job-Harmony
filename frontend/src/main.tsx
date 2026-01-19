import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './components/root';
import configureStore from './store/store';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken } from './util/session_api_util';
import { logout } from './actions/session_actions';
import type { SessionUser } from './reducers/session_reducer';

interface DecodedToken extends SessionUser {
  exp: number;
}

const initializeApp = () => {
  let store;

  // If a returning user has a session token stored in localStorage
  if (localStorage.jwtToken) {
    // Set the token as a common header for all axios requests
    setAuthToken(localStorage.jwtToken);

    // Decode the token to obtain the user's information
    const decodedUser = jwtDecode<DecodedToken>(localStorage.jwtToken);

    // Create a preconfigured state we can immediately add to our store
    const preloadedState = {
      session: {
        isAuthenticated: true,
        user: decodedUser
      }
    };

    store = configureStore(preloadedState);

    const currentTime = Date.now() / 1000;

    // If the user's token has expired
    if (decodedUser.exp < currentTime) {
      // Logout the user and redirect to the login page
      store.dispatch(logout() as unknown as Parameters<typeof store.dispatch>[0]);
      window.location.href = '/login';
    }
  } else {
    // If this is a first time user, start with an empty store
    store = configureStore();
  }

  // Render our root component and pass in the store as a prop
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<Root store={store} />);
  }
};

initializeApp();
