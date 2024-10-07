import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example auth check using localStorage token

  return isAuthenticated ? children : <Navigate to="/auth" />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children is required
  isAuthenticated: PropTypes.bool.isRequired, // Validate that isAuthenticated is a boolean
};
export default PrivateRoute;
