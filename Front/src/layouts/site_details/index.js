import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import MDBox from 'components/MDBox';
import Header from './Components/Header';
import { Grid } from '@mui/material';
import SiteInfoCard from 'examples/Cards/SiteInfoCard';
import SiteService from 'services/Site_Services/siteService';
import { AlertDescription, Alert } from 'components/ui/alert';
import SiteModal from 'examples/popup/SitePopUp';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

function SiteDetails() {
  const location = useLocation();
  const { EB } = location.state || {};
  const [site, setSite] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleEditClick = async () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchSiteInfoDetails = async () => {
    try {
      const result = await SiteService.getSiteById(EB);
      if (result.success) {
        console.log('Fetched site details:', result.data);
        setSite(result.data[0]);
      } else {
        console.error('Failed to fetch site details:', result.error);
      }
    } catch (error) {
      console.error('Error during fetch:', error.message);
    }
  };

  const handleSave = async updatedSite => {
    try {
      const result = await SiteService.updateSite(updatedSite.EB, updatedSite);
      if (result.success) {
        setSite(updatedSite);
        setShowModal(false);
        console.log('Site updated successfully:', updatedSite);
        await fetchSiteInfoDetails();
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
        <DashboardNavbar />
        <MDBox mb={2} />
        <MDBox px={3}>
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Erreur : Les détails du site ne sont pas disponibles. Veuillez naviguer depuis la page
              appropriée.
            </AlertDescription>
          </Alert>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={3} py={2}>
        <Grid container spacing={0} alignItems="flex-start">
          <Grid item xs={12} md={2}>
            {site ? (
              <SiteInfoCard site={site} onEdit={handleEditClick} />
            ) : (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>Chargement des détails du site...</AlertDescription>
              </Alert>
            )}
          </Grid>
          <Grid item xs={12} md={10}>
            {site ? (
              <Header style={{ height: '100%', minHeight: '600px', padding: '20px' }} />
            ) : (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>Chargement des détails du site...</AlertDescription>
              </Alert>
            )}
          </Grid>
        </Grid>
      </MDBox>
      {showModal && <SiteModal site={site} onSave={handleSave} onClose={handleCloseModal} />}
    </DashboardLayout>
  );
}
export default SiteDetails;
