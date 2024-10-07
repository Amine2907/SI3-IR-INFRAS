import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
// Private Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
export default ProtectedRoute;
