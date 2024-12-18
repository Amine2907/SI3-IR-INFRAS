/* eslint-disable */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import SiteDevisService from 'services/site_details/Devis/DevisService';
import DevisAddingModal from '../DevisAdding';
import useDevisForSite from '../DevisList/devisService';
function DevisHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fetchDevisData } = useDevisForSite(Sid);

  const handleAddDevis = async data => {
    const { devisData } = data;
    try {
      // Create new devis
      const result = await SiteDevisService.createDevis({ Sid, devisData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Devis enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        fetchDevisData();
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du devis.",
        type: 'error',
      });
    }
  };
  return (
    <div className="devis-list">
      <Card id="devis-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Devis
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <DevisAddingModal Sid={Sid} devis={selectedDevis} onSave={handleAddDevis} />
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
export default DevisHeader;
