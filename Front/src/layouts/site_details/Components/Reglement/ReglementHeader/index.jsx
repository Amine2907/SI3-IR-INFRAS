/* eslint-disable */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import SiteReglementService from 'services/site_details/Reglement/ReglementService';
import ReglementAddingModal from '../ReglementAdding';
function ReglementHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedReglement, setSelectedReglement] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fetchreglementData } = useReglementForSite(Sid);

  const handleAddRegl = async data => {
    const { reglementData } = data;
    try {
      // Create new Reglement
      const result = await SiteReglementService.createReglement({ Sid, reglementData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Reglement enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchreglementData();
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du Reglement.",
        type: 'error',
      });
    }
  };
  return (
    <div className="Reglement-list">
      <Card id="Reglement-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Reglement
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <ReglementAddingModal Sid={Sid} Reglement={selectedReglement} onSave={handleAddRegl} />
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
export default ReglementHeader;
