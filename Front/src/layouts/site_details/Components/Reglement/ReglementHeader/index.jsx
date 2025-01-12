/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import ReglementAddingModal from '../ReglementAdding';
import sitePaiementService from 'services/site_details/Reglement/Paiement/PaiementService';
import useReglForSite from '../ReglementList/reglementService';
function ReglementHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState(null);
  const [isPaiementCreated, setIsPaiementCreated] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fetchPaiementData } = useReglForSite(Sid);

  const handleAddRegl = async data => {
    const { paiementData } = data;
    try {
      // Create new Reglement
      const result = await sitePaiementService.createPaie({ Sid, paiementData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Reglement enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        setSelectedPaiement(null);
        setIsPaiementCreated(true);
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
  useEffect(() => {
    if (isPaiementCreated) {
      fetchPaiementData(); // Trigger data fetch
      setIsPaiementCreated(false); // Reset the flag to prevent infinite loop
    }
  }, [isPaiementCreated, fetchPaiementData]);
  return (
    <div className="Reglement-list">
      <Card id="Reglement-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Reglement
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <ReglementAddingModal Sid={Sid} Reglement={selectedPaiement} onSave={handleAddRegl} />
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
