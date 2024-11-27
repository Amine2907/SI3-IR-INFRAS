/* eslint-disable */
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import { Switch } from '@mui/material';
import ProspectModal from 'examples/popup/ProspectsPopUp/ProspectPopUp';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
// import MDAlert from 'components/MDAlert';
// import { Alert, AlertDescription } from 'components/ui/alert';
function Pheader() {
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedprospect, setSelectedprospect] = useState(null);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleAddProspect = () => {
    setShowModal(true);
  };
  const handleChange = () => {
    null;
  };
  const handleSave = async data => {
    let result;
    let successMessage = '';
    if (selectedprospect) {
      // Update entity
      result = await SiteProspectService.updateProspect(selectedprospect.Proid, data);
      successMessage = 'Entité mise à jour avec succès !';
    } else {
      // Create new entity
      result = await entityService.createProspect(Sid, data);
      successMessage = 'Entité enregistrée avec succès !';
    }
    // Handle the result with alert feedback
    if (result.success) {
      setAlert({ show: true, message: successMessage, type: 'success' });
    } else {
      setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
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
          <MDTypography variant="h6" fontWeight="medium">
            {isActive ? 'Active' : 'Inactive'}
          </MDTypography>
          <Switch
            checked={isActive}
            onChange={() => handleChange}
            style={{ marginRight: '10px' }}
          />
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
