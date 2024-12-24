/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import TraveauxAddingModal from '../TraveauxAdding';
import siteTravService from 'services/site_details/Traveaux/TraveauxService';
import useTravForSite from '../TraveauxList/traveauxService';
function TraveauxHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedTrav, setSelectedTrav] = useState(null);
  const [isTraveauxCreated, setisTraveauxCreated] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fecthTravData } = useTravForSite(Sid);

  const handleAddTrav = async data => {
    const { traveauxData } = data;
    try {
      // Create new Traveaux
      const result = await siteTravService.createTrav({ Sid, traveauxData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Traveaux enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        setSelectedTrav(null);
        setisTraveauxCreated(true);
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du Traveaux.",
        type: 'error',
      });
    }
  };
  useEffect(() => {
    if (isTraveauxCreated) {
      fecthTravData(); // Trigger data fetch
      setisTraveauxCreated(false); // Reset the flag to prevent infinite loop
    }
  }, [isTraveauxCreated, fecthTravData]);
  return (
    <div className="Traveaux-list">
      <Card id="Traveaux-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Traveaux
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <TraveauxAddingModal Sid={Sid} Traveaux={selectedTrav} onSave={handleAddTrav} />
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
export default TraveauxHeader;
