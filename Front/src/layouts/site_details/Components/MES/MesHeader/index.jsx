/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDAlert from 'components/MDAlert';
import useMesForSite from '../MesList/mesService';
import siteMesService from 'services/site_details/MES/MesService';
import MesAddingModal from '../MesAdding';
function MESHeader() {
  const [alert, setAlert] = useState(false);
  const [selectedMes, setSelectedMes] = useState(null);
  const [isMesCreated, setIsMesCreated] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const { fetchMesData } = useMesForSite(Sid);

  const handleAddMes = async data => {
    const { mesData } = data;
    try {
      // Create new MES
      const result = await siteMesService.createMes({ Sid, mesData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'MES enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
        setSelectedMes(null);
        setIsMesCreated(true);
      } else {
        let errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: "Une erreur est survenue lors de l'enregistrement du MES.",
        type: 'error',
      });
    }
  };
  useEffect(() => {
    if (isMesCreated) {
      fetchMesData(); // Trigger data fetch
      setIsMesCreated(false); // Reset the flag to prevent infinite loop
    }
  }, [isMesCreated, fetchMesData]);
  return (
    <div className="MES-list">
      <Card id="MES-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            MES
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <MesAddingModal Sid={Sid} mes={selectedMes} onSave={handleAddMes} />
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
export default MESHeader;
