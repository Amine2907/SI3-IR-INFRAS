import React from 'react';
import { Card, Grid, AppBar, Tabs, Tab, Icon } from '@mui/material';
import MDBox from 'components/MDBox';
import HeaderFunctions from './HeaderFuncsS';

function Header() {
  const { tabsOrientation, tabValue, handleSetTabValue, renderTabContent } = HeaderFunctions();

  return (
    <MDBox position="relative" mb={5}>
      <MDBox pt={4} px={2} justifyContent="space-between" alignItems="center">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center" />
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
            <Grid item xs={12}>
              <AppBar position="static" color="transparent" sx={{ boxShadow: 'none' }}>
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: 2,
                    },
                    '& .MuiTab-root': {
                      minHeight: 72,
                      minWidth: 180,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    },
                    '& .Mui-selected': {
                      backgroundColor: 'black',
                      color: 'white',
                    },
                  }}
                >
                  {[
                    { label: 'Prospects', icon: 'person_add' },
                    { label: 'PreEtude', icon: 'assignment' },
                    { label: 'DR', icon: 'business' },
                    { label: 'Devis', icon: 'receipt' },
                    { label: 'Règlement', icon: 'payment' },
                    { label: 'Traveaux', icon: 'build' },
                    { label: 'MES', icon: 'settings' },
                  ].map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.label}
                      icon={<Icon fontSize="medium">{tab.icon}</Icon>}
                      iconPosition="start"
                    />
                  ))}
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
