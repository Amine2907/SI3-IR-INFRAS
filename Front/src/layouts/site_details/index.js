// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
// Overview page components
import Header from './Components/Header';
// import SiteCard from 'examples/Cards/SiteCard';
import { Grid } from '@mui/material';
function SiteDetails() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {/* Grid container to create a two-column layout */}
      <MDBox px={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {/* <SiteCard site={site} /> */}
          </Grid>
          <Grid item xs={12} md={8}>
            <Header />
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
export default SiteDetails;
