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
// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
export default ProtectedRoute;
