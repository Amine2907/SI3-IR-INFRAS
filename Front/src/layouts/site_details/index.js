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
// import { ArrowLeft } from 'lucide-react';

function SiteDetails() {
  const location = useLocation();
  // const navigate = useNavigate();
  const { EB } = location.state || {};
  const [site, setSite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState(
    site || {
      priorite_fk: { SP_desc: '' },
      status_site_fk: { SS_desc: '' },
      programme_fk: { PR_desc: '' },
      Acteur_ENEDIS_id: { nom: '' },
    }
  );

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

  const handleSave = async () => {
    const Sid = site.EB;
    const result = await SiteService.updateSite(Sid, formData);
    if (result.success) {
      console.log('Site updated successfully:', result.data);
      fetchSiteDetails(EB);
      setShowModal(false);
    } else {
      console.error('Failed to update site:', result.error);
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
