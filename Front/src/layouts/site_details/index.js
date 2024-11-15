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
import { AlertDescription, Alert } from 'components/ui/alert';
function SiteDetails() {
  const location = useLocation();
  const { EB } = location.state || {};
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
      setSite(result.data[0]);
    } else {
      console.error('Failed to fetch site details:', result.error);
    }
  };
  const handleEditClick = () => {
    console.log('Edit button clicked');
  };

  if (!EB) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
        <MDBox px={3}>
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Error: Site details are not available. Please navigate from the appropriate page.
            </AlertDescription>
          </Alert>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <MDBox px={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {site ? (
              <SiteInfoCard site={site} onEdit={handleEditClick} />
            ) : (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>Loading site details...</AlertDescription>
              </Alert>
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
