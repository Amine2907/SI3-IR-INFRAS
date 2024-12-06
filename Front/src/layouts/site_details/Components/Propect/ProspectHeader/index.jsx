/* eslint-disable */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import ProspectModal from 'examples/popup/ProspectsPopUp/ProspectPopUp';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
import MDAlert from 'components/MDAlert';
import CombinedStorageModal from 'examples/popup/ProspectDpStoragePopUp/CombinedSPopUp';
function Pheader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setshowUploadModal] = useState(false);
  const [selectedprospect, setSelectedprospect] = useState(null);
  const [selecteddp, setSelecteddp] = useState(null);
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
  const handleSave = async data => {
    const { prospectData } = data;
    try {
      // Create new prospect
      const result = await SiteProspectService.createProspect({ Sid, prospectData });
      let successMessage = '';
      if (result.success) {
        successMessage = 'Prospect enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
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
        message: "Une erreur est survenue lors de l'enregistrement du prospect.",
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
            Prospects
          </MDTypography>
          <MDBox display="flex" gap={2}>
            <MDButton onClick={handleAddProspect} variant="gradient" color="dark">
              <Icon sx={{ fontWeight: 'bold' }}>add</Icon>&nbsp;Ajouter Prospect
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
      {showUploadModal && (
        <CombinedStorageModal
          prospect={selectedprospect}
          dp={selecteddp}
          onSaveProspect={handleSave}
          onSaveDp={handleSave}
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
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
export default Pheader;
