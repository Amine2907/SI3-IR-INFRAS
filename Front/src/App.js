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
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from 'context';
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';
import AuthPage from 'layouts/authentification/AuthPage';
import ProtectedRoute from 'PrivateRoute';
import Dashboard from 'layouts/dashboard';
import { AuthProvider, useAuth } from 'context/Auth/AuthContext';
import PropTypes from 'prop-types';

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const { pathname } = useLocation();

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
      {controller.layout === 'dashboard' && pathname !== '/auth' && (
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
