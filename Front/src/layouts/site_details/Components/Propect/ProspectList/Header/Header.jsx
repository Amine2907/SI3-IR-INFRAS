/* eslint-disable */
import React from 'react';
import { Card, Grid, AppBar, Tabs, Tab, Icon } from '@mui/material';
import MDBox from 'components/MDBox';
import HeaderListFunctions from './HeaderFuncs';

function HeaderList() {
  const { tabsOrientation, tabValue, handleSetTabValue, renderTabContent } = HeaderListFunctions();

  return (
    <MDBox position="relative" mb={3}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="3rem"
        borderRadius="xl"
        sx={{
          overflow: 'hidden',
        }}
      />
      <Card
        sx={{
          position: 'relative',
          mt: -6,
          mx: 2,
          py: 1,
          px: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {' '}
          {/* Reduced spacing */}
          <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
            <AppBar position="static" elevation={0}>
              {' '}
              {/* Removed shadow */}
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="Prospects"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      person
                    </Icon>
                  }
                />
                <Tab
                  label="Déclarations préalables"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      person
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        <MDBox mt={3}>{/* Reduced mt value */ renderTabContent()}</MDBox>
      </Card>
    </MDBox>
  );
}

export default HeaderList;
