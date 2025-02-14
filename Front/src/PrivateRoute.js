/**
 * If the user is authenticated, renders the children component.
 * If the user is not authenticated, redirects to the /auth route.
 * @param {React.ReactNode} children The component to render if the user is authenticated.
 * @param {Boolean} isAuthenticated Whether the user is authenticated or not.
 * @returns {React.ReactNode} Either the children component or a redirect to the /auth route.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from 'context/Auth/AuthContext';
import LoadingSpinner from 'examples/Items/CircularSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
