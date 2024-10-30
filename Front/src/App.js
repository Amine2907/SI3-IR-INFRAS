/**
 * This function is the main entry point for the application.
 * It uses the MaterialUIController to get the current state
 * of the theme and sidenav, and renders the main components
 * based on the current route.
 *
 * @function App
 * @returns {ReactElement} The main application component.
 */
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';
import theme from 'assets/theme';
import themeDark from 'assets/theme-dark';
import routes from 'routes';
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from './context/index';
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';
import AuthPage from 'layouts/authentification/AuthPage';
import ProtectedRoute from 'PrivateRoute';
import Dashboard from 'layouts/dashboard';
import { AuthProvider, useAuth } from 'context/Auth/AuthContext';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from 'layouts/authentification/ResetPasswordForm';
import ConfirmSignup from 'layouts/authentification/ConfirmSignUp';
import ProfileModal from 'examples/popup/SettingsPopUp/ProfilePopUp';
export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isTokenExpired = token => {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    const expirationTime = payload.exp * 1000; // Convert exp to milliseconds
    return Date.now() >= expirationTime; // Check if the current time exceeds the expiration time
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      navigate('/auth');
    }
  }, [navigate]);
  return (
    <AuthProvider>
      <InnerApp
        controller={controller}
        dispatch={dispatch}
        pathname={pathname}
        theme={darkMode ? themeDark : theme}
        darkMode={darkMode}
      />
    </AuthProvider>
  );
}
function InnerApp({ controller, dispatch, pathname, theme, darkMode }) {
  // Receive darkMode as a prop
  const { isAuthenticated } = useAuth();
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const navigate = useNavigate();
  const handleOnMouseEnter = () => {
    if (controller.miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => {
    setOpenConfigurator(dispatch, !controller.openConfigurator);
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);
  useEffect(() => {
    const publicPaths = ['/auth/confirm-sign-up', '/auth/confirm-reset-password'];
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      navigate('/auth', { replace: true });
    }
    const handlePopState = () => {
      if (!isAuthenticated && !publicPaths.includes(pathname)) {
        navigate('/dashboard', { replace: true });
      }
    };
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, pathname, navigate]);

  const getRoutes = allRoutes =>
    allRoutes.map(route => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      return null;
    });
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {controller.layout === 'dashboard' && !pathname.startsWith('/auth') && (
        <>
          <Sidenav
            color={controller.sidenavColor}
            brand={
              (controller.transparentSidenav && !darkMode) || controller.whiteSidenav
                ? brandDark
                : brandWhite
            }
            brandName="SI3 Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/confirm-reset-password" element={<ResetPasswordForm />} />
        <Route path="/auth/confirm-sign-up" element={<ConfirmSignup />} />
        <Route path="/popup/profile" element={<ProfileModal />} />
      </Routes>
    </ThemeProvider>
  );
}
InnerApp.propTypes = {
  controller: PropTypes.shape({
    miniSidenav: PropTypes.bool,
    layout: PropTypes.string,
    openConfigurator: PropTypes.bool,
    sidenavColor: PropTypes.string,
    transparentSidenav: PropTypes.bool,
    whiteSidenav: PropTypes.bool,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
