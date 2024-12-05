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
import DpStorageService from 'services/site_details/DP/dpStorageService';
function Pheader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedprospect, setSelectedprospect] = useState(null);
  const [alert, setAlert] = useState(false);
  const location = useLocation();
  const { EB } = location.state || {};
  const Sid = EB;
  const handleCloseModal = () => {
    setShowModal(false);
  };
  // const handleFileChange = event => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setFile(file);
  //     setError('');
  //   }
  // };
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first!');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file); // Add the file to the form data
      // Call the upload service to upload the file
      const response = await DpStorageService.uploadDp(formData);
      console.log('API result:', response);
      if (response.success) {
        setSuccess('File uploaded successfully!');
        setError('');
      } else {
        setError(response.error || 'Upload failed. Please try again!');
      }
    } catch (error) {
      setError('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };
  const handleAddProspect = () => {
    setShowModal(true);
  };
  const handleSave = async data => {
    const { prospectData } = data;
    console.log('Sending request with Sid:', Sid);
    console.log('Form Data:', data); // Log all form data
    try {
      // Create new prospect
      const result = await SiteProspectService.createProspect({ Sid, prospectData });
      console.log('API result:', result);
      let successMessage = '';
      if (result.success) {
        successMessage = 'Prospect enregistré avec succès !';
        setAlert({ show: true, message: successMessage, type: 'success' });
      } else {
        const errorMessage = `Error: ${result.error}`;
        console.error(errorMessage); // Log any errors from the API response
        setAlert({ show: true, message: errorMessage, type: 'error' });
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      setAlert({
        show: true,
        message: 'An error occurred while saving the prospect.',
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
