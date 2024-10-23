import { useState, useEffect } from 'react';

// prop-types is a library for typechecking of props.
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAvatar from 'components/MDAvatar';

// Material Dashboard 2 React base styles
import breakpoints from 'assets/theme/base/breakpoints';

// Import external pages (components)
// import Account from '../Account';
// import User from '../Users';
// import Company from '../Companies';
function Header() {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    window.addEventListener('resize', handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Render the external component based on the selected tab
  // const renderComponent = () => {
  //   switch (tabValue) {
  //     case 0:
  //       return <Account />;
  //     case 1:
  //       return <User />;
  //     case 2:
  //       return <Company />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${''})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%',
          overflow: 'hidden',
        }}
      />
      <Card
        sx={{
          position: 'relative',
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={''} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                Richard Davis
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Compte"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
                <Tab
                  label="Utilisateur"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      person
                    </Icon>
                  }
                />
                <Tab
                  label="Entreprise"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      business
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {/* Render the external component based on the selected tab
        <MDBox mt={3}>{renderComponent()}</MDBox>
        {children} */}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: '',
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
