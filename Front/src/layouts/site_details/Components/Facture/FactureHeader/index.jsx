/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import useFactureForSite from '../FactureList/factureService';
import siteFactureService from 'services/site_details/MES/MesService';
import FactureAddingModal from '../FactureAdding';
function FactureHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [isFactureCreated, setIsFactureCreated] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fetchFactureData } = useFactureForSite(Sid);

  const handleAddFacture = async data => {
    const { factureData } = data;
    try {
      // Create new Facture
      const result = await siteFactureService.createFacture({ Sid, factureData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Facture enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        setSelectedFacture(null);
        setIsFactureCreated(true);
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du Facture.",
        type: 'error',
      });
    }
  };
  useEffect(() => {
    if (isFactureCreated) {
      fetchFactureData(); // Trigger data fetch
      setIsFactureCreated(false); // Reset the flag to prevent infinite loop
    }
  }, [isFactureCreated, fetchFactureData]);
  return (
    <div className="MES-list">
      <Card id="MES-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Facture
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <FactureAddingModal Sid={Sid} facture={selectedFacture} onSave={handleAddFacture} />
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
export default FactureHeader;
