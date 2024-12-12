/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ProspectModal from 'examples/popup/ProspectsPopUp/ProspectPopUp';
import SiteDemracService from 'services/site_details/DR/DrService';
import MDAlert from 'components/MDAlert';
function DemRacHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setshowUploadModal] = useState(false);
  const [selectedprospect, setSelectedprospect] = useState(null);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpload = async () => {
    setshowUploadModal(true);
    setIsModalOpen(true);
  };

  const handleAddProspect = () => {
    setShowModal(true);
  };
  const fetchDemRacData = useCallback(async () => {
    if (Sid) {
      try {
        setLoading(true);
        const response = await SiteDemracService.getDemRacSite(Sid);
        if (response.success && response.data) {
          setLocalUserData(response.data);
        } else {
          setError(
            response.error?.message ||
              'Échec de la récupération des données demandes de raccordements.'
          );
        }
      } catch (err) {
        setError('An error occurred while fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('Les informations utilisateur ne sont pas disponibles');
    }
  }, []);
  // Fetch the prospects data whenever the Sid changes
  useEffect(() => {
    fetchDemRacData();
  }, [Sid]);

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
        fetchDemRacData(); // Refetch the data to include the newly created prospect
      } else {
        let errorMessage = `Error: ${result.error}`;
        // Check if the error is related to a prospect already existing with status 'Prospect Validé'
        if (result.error.includes("A prospect with status 'Prospect Validé' already exists")) {
          errorMessage = 'Il y a déjà un prospect avec le statut "Prospect Validé" pour ce site.';
        }
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
      <Card id="prospect-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Demandes de raccordements
          </MDTypography>
          <MDBox display="flex" gap={2}>
            <MDButton onClick={handleAddProspect} variant="gradient" color="dark">
              <Icon sx={{ fontWeight: 'bold' }}>add</Icon>&nbsp;Ajouter DR
            </MDButton>
            <MDButton onClick={handleUpload} variant="gradient" color="dark">
              <Icon sx={{ fontWeight: 'bold' }}>upload</Icon>&nbsp;Telecharger
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
      {showModal && (
        <ProspectModal prospect={selectedprospect} onSave={handleSave} onClose={handleCloseModal} />
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
export default DemRacHeader;
