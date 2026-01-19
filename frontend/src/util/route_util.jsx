import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const AuthRoute = ({ element }) => {
  const loggedIn = useSelector((state) => state.session.isAuthenticated);

  if (loggedIn) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export const ProtectedRoute = ({ element }) => {
  const loggedIn = useSelector((state) => state.session.isAuthenticated);

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  return element;
};
