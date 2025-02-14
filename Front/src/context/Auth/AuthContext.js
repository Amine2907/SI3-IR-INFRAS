/**
 * This file contains the AuthContext and the AuthProvider.
 * The AuthContext is the context which holds the state of the user (isAuthenticated and user).
 * The AuthProvider is a component which wraps the children components and provides the context to them.
 * The AuthProvider uses the useState and useEffect hooks to set the state of the user based on the local storage and the authentication API.
 * The AuthProvider also exports a few functions which can be used to login, logout and check the user state.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading as true

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true); // Ensure loading is set at the beginning

      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user data from localStorage (if stored)
          const userData = JSON.parse(localStorage.getItem('user'));
          console.log('User data from localStorage:', userData);

          if (userData) {
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Failed to parse user data', error);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading(false); // Set loading to false after checking
    };

    checkUser();
  }, []);

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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
