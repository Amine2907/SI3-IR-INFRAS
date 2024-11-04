/**
 * Header component is responsible for rendering the header, which contains tabs with the routes to Settings, Users, and Companies.
 * It also handles the orientation of the tabs based on the screen size, and renders the appropriate component based on the selected tab.
 * @returns {Object} An object containing the state values and functions:
 *   - tabsOrientation: The orientation of the tabs ('horizontal' or 'vertical')
 *   - tabValue: The currently selected tab (0, 1, or 2)
 *   - handleSetTabValue: A function to set the currently selected tab
 *   - userData: The user data object
 *   - renderTabContent: A function to render the appropriate component based on the selected tab
 */
import React from 'react';
import { Card, Grid, AppBar, Tabs, Tab, Icon, Avatar } from '@mui/material';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import HeaderFunctions from './headerFuncs';

function Header() {
  const { tabsOrientation, tabValue, handleSetTabValue, userData, renderTabContent } =
    HeaderFunctions();

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
            <Avatar src={'/default-avatar.png'} size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {`${userData.firstname} ${userData.lastname}`}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Paramètres"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
                <Tab
                  label="Utiisateur"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      person
                    </Icon>
                  }
                />
                <Tab
                  label="Entreprises"
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
        <MDBox mt={5}>{renderTabContent()}</MDBox>
      </Card>
    </MDBox>
  );
}
export default Header;
