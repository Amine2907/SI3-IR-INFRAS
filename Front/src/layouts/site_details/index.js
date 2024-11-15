// eslint-disable-next-line no-unused-vars
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
// Overview page components
import Header from './Components/Header';
import { Grid } from '@mui/material';
import SiteInfoCard from 'examples/Cards/SiteInfoCard';
import SiteService from 'services/Site_Services/siteService';
function SiteDetails() {
  const location = useLocation();
  const { EB } = location.state || {};
  // eslint-disable-next-line no-unused-vars
  const [site, setSite] = useState(null);

  useEffect(() => {
    if (EB) {
      fetchSiteDetails(EB);
    }
  }, [EB]);

  const fetchSiteDetails = async EB => {
    const result = await SiteService.getSiteById(EB);
    if (result.success) {
      console.log('Fetched site details:', result.data);
      // Use `result.data` to populate the details page
    } else {
      console.error('Failed to fetch site details:', result.error);
    }
  };
  const handleEditClick = () => {
    null;
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {/* Grid container to create a two-column layout */}
      <MDBox px={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {site ? (
              <SiteInfoCard site={site} onEdit={handleEditClick} />
            ) : (
              <p>Loading site details...</p>
            )}
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
