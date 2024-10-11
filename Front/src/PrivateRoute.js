import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/auth/signup" />;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
export default ProtectedRoute;
