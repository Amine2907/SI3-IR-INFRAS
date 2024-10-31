/**
 * AuthProvider component
 *
 * This component provides authentication context to its child components.
 * It manages the authentication state, including whether a user is authenticated,
 * the user information, and loading state. It also provides login and logout functions
 * to manage user sessions.
 *
 * On mount, it checks if a valid token exists in localStorage to determine
 * the initial authentication state and user data.
 *
 * @param {ReactNode} children - The child components that will have access to
 * the authentication context.
 * @returns {ReactElement} The AuthProvider component wrapping its children
 * with AuthContext.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // You can fetch the user data based on the token here, if needed
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log('User data from localStorage:', userData);
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data', error);
        // Handle parsing error (maybe reset authentication)
      }
    } else {
      // Token is missing, maybe handle unauthenticated state
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    console.log('Logging in with user data:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
