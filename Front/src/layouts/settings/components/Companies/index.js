import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import MDBox from 'components/MDBox';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Header from '../Header';
function Company() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          {/* <Grid container spacing={1}> */}
          <Grid item xs={12} md={6} xl={4}>
            {/* <PlatformSettings /> */}
            <Grid item xs={12} md={6} xl={4} sx={{ display: 'flex' }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Informations de profil"
                info={{
                  fullName: 'Alec M. Thompson',
                  Role: '',
                  email: 'alecthompson@mail.com',
                  Gnere: '',
                  'Date de naissance': '',
                }}
                action={{ route: '', tooltip: 'Modifier Profile' }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}
export default Company;
