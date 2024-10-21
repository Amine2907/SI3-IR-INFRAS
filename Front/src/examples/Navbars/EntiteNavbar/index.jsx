import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import Breadcrumbs from 'examples/Breadcrumbs';
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from 'examples/Navbars/DashboardNavbar/styles';
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from '../../../context/index';
import entityService from 'services/entityService';
import EntiteCard from 'examples/Cards/EntiteCard/EntiteCard';
import { Grid } from '@mui/material';
function EntiteNavBr({ absolute, light, isMini }) {
  const [entities, setEntities] = useState([]);
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split('/').slice(1);
  const [searchQuery, setSearchQuery] = useState({
    nom: '',
    role: '',
    email: '',
    ville: '',
    region: '',
    code_postal: '',
  });
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const debouncedSearchEntities = useCallback(
    debounce(async query => {
      const filters = {
        nom: query.nom,
        role: query.role,
        email: query.email,
        ville: query.ville,
        region: query.region,
        code_postal: query.code_postal,
      };
      const result = await entityService.searchEntities(filters);
      if (result.success) {
        setEntities(result.data);
      } else {
        console.error(result.error);
      }
    }, 500),
    []
  );
  const handleSearchChange = e => {
    const { name, value } = e.target;

    setSearchQuery(prev => ({ ...prev, [name]: value }));

    if (value.trim() === '') {
      setEntities([]); // Clear entities if search is cleared
    } else {
      debouncedSearchEntities({ ...searchQuery, [name]: value });
    }
  };
  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType('sticky');
    } else {
      setNavbarType('static');
    }

    const handleTransparentNavbar = () => {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    };

    window.addEventListener('scroll', handleTransparentNavbar);
    handleTransparentNavbar();
    return () => window.removeEventListener('scroll', handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = event => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    ></Menu>
  );
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });
  return (
    <AppBar
      position={absolute ? 'absolute' : navbarType}
      color="inherit"
      sx={theme => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={theme => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={theme => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={theme => navbarRow(theme, { isMini })}>
            <MDBox pr={1}>
              <div className="contact-list">
                <MDInput
                  label="Search"
                  name="nom"
                  value={searchQuery.nom}
                  onChange={handleSearchChange}
                  style={{ marginBottom: '10px' }}
                />
              </div>
            </MDBox>
            <MDBox color={light ? 'white' : 'inherit'}>
              <Link to="/settings">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? 'menu_open' : 'menu'}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              ></IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      {/* Render the search results below the navbar */}
      <Grid container spacing={3}>
        {entities.length > 0 ? (
          entities.map(entite => (
            <Grid item xs={12} sm={8} md={4} key={entite.id}>
              <EntiteCard entite={entite} />
            </Grid>
          ))
        ) : searchQuery.nom.trim() === '' &&
          searchQuery.role.trim() === '' &&
          searchQuery.email.trim() === '' &&
          searchQuery.ville.trim() === '' &&
          searchQuery.region.trim() === '' &&
          searchQuery.code_postal.trim() === '' ? null : ( // Don't show "No results found" when no search is made
          <p>No results found</p>
        )}
      </Grid>
    </AppBar>
  );
}
// Setting default values for the props of EntiteNavBr
EntiteNavBr.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};
// Typechecking props for the EntiteNavBr
EntiteNavBr.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};
export default EntiteNavBr;
