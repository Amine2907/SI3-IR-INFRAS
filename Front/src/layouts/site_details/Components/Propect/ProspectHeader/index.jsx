/* eslint-disable */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ProspectModal from 'examples/popup/ProspectsPopUp/ProspectPopUp';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
// import MDAlert from 'components/MDAlert';
// import { Alert, AlertDescription } from 'components/ui/alert';
function Pheader() {
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedprospect, setSelectedprospect] = useState(null);
  const location = useLocation();
  const [alert, setAlert] = useState(false);
  // const navigate = useNavigate();
  const { EB } = location.state || {};

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleAddProspect = () => {
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };
  const fetchProspects = async () => {
    try {
      const response = await SiteProspectService.getProspectsSite(Sid);
      if (response && response.success) {
        setProspectsData(response.data);
      } else {
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (err) {
      setAlert({
        show: true,
        message: 'An error occurred while saving the prospect.',
        type: 'error',
      });
    }
  };
  const handleSave = async data => {
    const { prospectData } = data;
    const Sid = EB;
    console.log('Sending request with Sid:', Sid);
    console.log('Form Data:', data); // Log all form data
    try {
      // Create new prospect
      const result = await SiteProspectService.createProspect({ Sid, prospectData });
      console.log('API result:', result);
      let successMessage = '';
      if (result.success) {
        successMessage = 'Entité enregistrée avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchProspects();
      } else {
        const errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: 'An error occurred while saving the prospect.',
        type: 'error',
      });
    }
    handleModalClose();
  };
  return (
    <div className="prospect-list">
      <Card id="prospect-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Prospects
          </MDTypography>
          <MDButton onClick={handleAddProspect} variant="gradient" color="dark">
            <Icon sx={{ fontWeight: 'bold' }}>add</Icon>&nbsp;Ajouter Prospect
          </MDButton>
        </MDBox>
        <MDBox p={2}>
          {/* <MDTypography variant="h6" fontWeight="medium">
            {isActive ? 'Active' : 'Inactive'}
          </MDTypography>
          <Switch
            checked={isActive}
            onChange={() => handleChange}
            style={{ marginRight: '10px' }}
          /> */}
          {/* <Grid container spacing={3}>
            {companies.map(prospect => (
              <Grid item xs={12} sm={8} md={4} key={prospect.id}>
                <prospectCard
                  prospect={prospect}
                  onEdit={() => {
                    setSelectedprospect(prospect);
                    setShowModal(true);
                    setNoResultsMessage('');
                  }}
                />
              </Grid>
            ))} */}
          {/* </Grid> */}
          {/* Conditionally render the no results alert */}
          {/* {noResultsMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{noResultsMessage}</AlertDescription>
            </Alert>
          )} */}
        </MDBox>
      </Card>
      {showModal && (
        <ProspectModal prospect={selectedprospect} onSave={handleSave} onClose={handleCloseModal} />
      )}
      {/* {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => handleCloseAlert(setAlert)}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}  */}
    </div>
  );
}
export default Pheader;
