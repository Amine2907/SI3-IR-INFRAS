/* eslint-disable */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';
import PreEtudeAddingModal from '../PreEtudeAdding';
import SitePreEtudeService from 'services/site_details/PreEtude/preEtudeService';
function PreHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedPreEtude, setSelectedPreEtude] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const handleAddPreEtude = async data => {
    const { preEtudeData } = data;
    try {
      // Create new prospect
      const result = await SitePreEtudeService.createPreEtude({ Sid, preEtudeData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'PreEtude enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du pre-etude.",
        type: 'error',
      });
    }
  };
  return (
    <div className="prospect-list">
      <Card id="prospect-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            PreEtude
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <PreEtudeAddingModal Sid={Sid} preEtude={selectedPreEtude} onSave={handleAddPreEtude} />
      </Card>
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
export default PreHeader;
