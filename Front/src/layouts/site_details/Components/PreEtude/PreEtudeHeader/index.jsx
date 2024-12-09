/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDAlert from 'components/MDAlert';
import PreEtudeAddingModal from '../PreEtudeAdding';
function PreHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setshowUploadModal] = useState(false);
  const [alert, setAlert] = useState(false);
  const [selectedPreEtude, setSelectedPreEtude] = useState(null);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;

  const handleCloseModal = () => {
    null;
  };

  const handleUpload = async () => {
    setshowUploadModal(true);
    setIsModalOpen(true);
  };

  const handleAddProspect = () => {
    setShowModal(true);
  };
  const handleSave = () => {
    null;
  };
  //   const fetchPreEtudeData = useCallback(async () => {
  //     if (Sid) {
  //       try {
  //         setLoading(true);
  //         const response = await SiteProspectService.getProspectsSite(Sid);
  //         if (response.success && response.data) {
  //           setLocalUserData(response.data);
  //         } else {
  //           setError(response.error?.message || 'Échec de la récupération des données utilisateur.');
  //         }
  //       } catch (err) {
  //         setError('An error occurred while fetching user data: ' + err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setLoading(false);
  //       setError('Les informations utilisateur ne sont pas disponibles');
  //     }
  //   }, []);
  //   // Fetch the prospects data whenever the Sid changes
  //   useEffect(() => {
  //     fetchPreEtudeData();
  //   }, [Sid]);

  //   const handleSave = async data => {
  //     const { preEtudeData } = data;
  //     try {
  //       // Create new prospect
  //       const result = await SiteProspectService.createProspect({ Sid, preEtudeData });
  //       let successMessage = '';
  //       if (result.success) {
  //         successMessage = 'Prospect enregistré avec succès !';
  //         setAlert({ show: true, message: successMessage, type: 'success' });
  //         // After successfully creating the prospect, fetch the updated list of prospects
  //         fetchPreEtudeData(); // Refetch the data to include the newly created prospect
  //       } else {
  //         let errorMessage = `Error: ${result.error}`;
  //         // Check if the error is related to a prospect already existing with status 'Prospect Validé'
  //         if (result.error.includes("A prospect with status 'Prospect Validé' already exists")) {
  //           errorMessage = 'Il y a déjà un prospect avec le statut "Prospect Validé" pour ce site.';
  //         }
  //         console.error(errorMessage); // Log any errors from the API response
  //         setAlert({ show: true, message: errorMessage, type: 'error' });
  //       }
  //     } catch (error) {
  //       console.error('Error while sending request:', error);
  //       setAlert({
  //         show: true,
  //         message: "Une erreur est survenue lors de l'enregistrement du prospect.",
  //         type: 'error',
  //       });
  //     }
  //     handleCloseModal();
  //   };
  //   const handleStore = async (fileType, file) => {
  //     if (!file) {
  //       setAlert({
  //         show: true,
  //         message: `Please select a file to upload for ${
  //           fileType === 'prospect' ? 'Prospect' : 'DP'
  //         }.`,
  //         type: 'error',
  //       });
  //       return;
  //     }
  //     // Validate file size (e.g., <5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       setAlert({
  //         show: true,
  //         message: `File size exceeds the 5MB limit.`,
  //         type: 'error',
  //       });
  //       return;
  //     }
  //     try {
  //       let response;
  //       if (fileType === 'prospect') {
  //         response = await ProspectStorageService.uploadProspectFile(file);
  //       } else if (fileType === 'dp') {
  //         response = await DpStorageService.uploadDp(file);
  //       }

  //       if (response.success) {
  //         setAlert({
  //           show: true,
  //           message: `${fileType === 'prospect' ? 'Prospect' : 'DP'} file uploaded successfully!`,
  //           type: 'success',
  //         });
  //         fetchPreEtudeData();
  //       } else {
  //         throw new Error(response.error || 'Failed to upload file.');
  //       }
  //     } catch (error) {
  //       console.error(`Error uploading ${fileType} file:`, error);
  //       setAlert({
  //         show: true,
  //         message: `Failed to upload ${fileType === 'prospect' ? 'Prospect' : 'DP'} file.`,
  //         type: 'error',
  //       });
  //     }
  //   };
  return (
    <div className="prospect-list">
      <Card id="prospect-card">
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            PreEtude
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <PreEtudeAddingModal
          Sid={Sid}
          preEtude={selectedPreEtude}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
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
