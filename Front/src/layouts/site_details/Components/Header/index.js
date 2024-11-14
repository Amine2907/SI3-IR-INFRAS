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
import { Card, Grid, AppBar, Tabs, Tab, Icon } from '@mui/material';
import MDBox from 'components/MDBox';
import HeaderFunctions from './HeaderFuncsS';

function Header() {
  const { tabsOrientation, tabValue, handleSetTabValue, renderTabContent } = HeaderFunctions();

  return (
    // diplay="flex"
    <MDBox position="relative" mb={5}>
      <MDBox pt={4} px={2} justifyContent="space-between" alignItems="center">
        <MDBox
          pt={2}
          px={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        ></MDBox>
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
            <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
              <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: 2,
                    },
                    minHeight: 48,
                  }}
                  TabIndicatorProps={{
                    style: {
                      height: 4,
                    },
                  }}
                >
                  <Tab
                    label="Paramètres"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                    sx={{
                      minWidth: 120, // Sets a minimum width for each tab
                      padding: '12px 16px', // Adds more padding inside each tab
                      fontSize: '1rem', // Increases font size for better readability
                    }}
                  />
                  <Tab
                    label="Utilisateur"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        person
                      </Icon>
                    }
                    sx={{
                      minWidth: 120,
                      padding: '12px 16px',
                      fontSize: '1rem',
                    }}
                  />
                  <Tab
                    label="Entreprises"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        business
                      </Icon>
                    }
                    sx={{
                      minWidth: 120,
                      padding: '12px 16px',
                      fontSize: '1rem',
                    }}
                  />
                  <Tab
                    label="Paramètres"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                    sx={{
                      minWidth: 120,
                      padding: '12px 16px',
                      fontSize: '1rem',
                    }}
                  />
                  <Tab
                    label="Paramètres"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                    sx={{
                      minWidth: 120,
                      padding: '12px 16px',
                      fontSize: '1rem',
                    }}
                  />
                  <Tab
                    label="Paramètres"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                    sx={{
                      minWidth: 120,
                      padding: '12px 16px',
                      fontSize: '1rem',
                    }}
                  />
                  <Tab
                    label="Paramètres"
                    icon={
                      <Icon fontSize="small" sx={{ mt: -0.25 }}>
                        settings
                      </Icon>
                    }
                    sx={{
                      minWidth: 120, // Sets a minimum width for each tab
                      padding: '12px 16px', // Adds more padding inside each tab
                      fontSize: '1rem', // Increases font size for better readability
                    }}
                  />
                </Tabs>
              </AppBar>
            </Grid>
          </Grid>
          <MDBox mt={5}>{renderTabContent()}</MDBox>
        </Card>
      </MDBox>
    </MDBox>
  );
}
export default Header;
