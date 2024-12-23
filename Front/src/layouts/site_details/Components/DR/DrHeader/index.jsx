/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import SiteDemracService from 'services/site_details/DR/DrService';
import MDAlert from 'components/MDAlert';
import DrAddModal from 'examples/popup/DrPopUp/Add/DrAddPopUp';
import usedemracData from '../DrList/DrService';
import PropTypes from 'prop-types';
function DemRacHeader({ site }) {
  const { fetchDemracData } = usedemracData(site);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setshowUploadModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [selecteddemrac, setSelecteddemrac] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleUpload = async () => {
    setshowUploadModal(true);
  };
  const handleAddDr = () => {
    setShowModal(true);
  };
  // Fetch the prospects data whenever the Sid changes
  useEffect(() => {
    if (Sid) {
      fetchDemracData();
    }
  }, [site, fetchDemracData, Sid]);
  const handleSave = async data => {
    const { demracData } = data;
    try {
      // Create new prospect
      const result = await SiteDemracService.createDemRac({ Sid, demracData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Dem rac enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        // After successfully creating the prospect, fetch the updated list of prospects
        fetchDemracData();
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du demande.",
        type: 'error',
      });
    }
    handleCloseModal();
  };
  return (
    <div className="prospect-list">
      {/* Card for "Demandes de raccordements" */}
      <Card id="prospect-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Demandes de raccordements
          </MDTypography>
          <MDBox display="flex" gap={2}>
            <MDButton onClick={handleAddDr} variant="gradient" color="dark">
              <Icon sx={{ fontWeight: 'bold' }}>add</Icon>&nbsp;Ajouter DR
            </MDButton>
            <MDButton onClick={handleUpload} variant="gradient" color="dark">
              <Icon sx={{ fontWeight: 'bold' }}>upload</Icon>&nbsp;Telecharger
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
      {/* Modal for adding a new demande */}
      {showModal && (
        <DrAddModal
          Sid={Sid}
          demrac={selecteddemrac}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
      {/* Display Alert if there's an error */}
      {alert.show && (
        <MDAlert
          color={alert.type}
          dismissible
          onClose={() => setAlert({ show: false })}
          style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
        >
          {alert.message}
        </MDAlert>
      )}
    </div>
  );
}
DemRacHeader.propTypes = {
  site: PropTypes.string.isRequired,
};
export default DemRacHeader;
