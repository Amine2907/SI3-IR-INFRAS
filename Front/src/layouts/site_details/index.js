import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import Header from './Components/Header';
import { Grid } from '@mui/material';
import SiteInfoCard from 'examples/Cards/SiteInfoCard';
import SiteService from 'services/Site_Services/siteService';
import { AlertDescription, Alert } from 'components/ui/alert';
import SiteModal from 'examples/popup/SitePopUp';
import SiteInfoNavbar from 'examples/Navbars/SiteInfoNavbar';
function SiteDetails() {
  const location = useLocation();
  // const navigate = useNavigate();
  const { EB } = location.state || {};
  const [site, setSite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState(site);
  // Fetch site details when the component mounts
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
  // Function to handle the "Edit" button click
  const handleEditClick = async () => {
    setShowModal(true);
  };
  //  Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSave = async updatedSite => {
    try {
      const result = await SiteService.updateSite(updatedSite.EB, updatedSite);
      if (result.success) {
        setSite(updatedSite);
        setShowModal(false);
        console.log('Site updated successfully:', updatedSite);
      } else {
        console.error('Failed to update site:', result.error);
      }
    } catch (error) {
      console.error('Error updating site:', error.message);
    }
  };
  if (!EB) {
    return (
      <DashboardLayout>
        <SiteInfoNavbar />
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
      <SiteInfoNavbar />
      <MDBox px={3} py={2}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} style={{ marginBottom: '-20px' }}></Grid>
          <Grid item xs={12} md={3}>
            {site ? (
              <SiteInfoCard site={site} onEdit={handleEditClick} />
            ) : (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>Loading site details...</AlertDescription>
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Header />
          </Grid>
        </Grid>
      </MDBox>
      {showModal && <SiteModal site={site} onSave={handleSave} onClose={handleCloseModal} />}
      <Footer />
    </DashboardLayout>
  );
}
export default SiteDetails;
