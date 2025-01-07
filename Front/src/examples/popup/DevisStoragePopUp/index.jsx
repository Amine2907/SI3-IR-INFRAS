/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import MDButton from 'components/MDButton';
import Typography from '@mui/material/Typography';
import WarningPopUp from '../userPopUp/WariningPopUp';
import devisStorageService from 'services/site_details/Devis/DevisStorageService';

const devisStorageModal = ({ devisId, fetchFiles, onSave, onClose }) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null); // Track the file to delete
  const DeleteMessage = 'Etes vous sure vous voulez supprimer ce fichier !';

  useEffect(() => {
    const fecthFilesForDevis = async () => {
      if (!devisId) {
        console.error('No prospect ID provided.');
        return;
      }
      setLoading(true);
      try {
        const filesData = await fetchFiles();
        setFiles(filesData || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fecthFilesForDevis();
  }, [devisId, fetchFiles]);

  // Submit form to upload a file
  const handleSubmit = async () => {
    const file = files[0]?.file; // Get the first file to upload
    if (!file) {
      setErrors({ file: 'Please upload a file.' });
      return;
    }
    try {
      const result = await devisStorageService.uploadDevisFile(file, devisId);
      if (result.success) {
        console.log('File uploaded successfully:', result.data);
        // Handle the successful upload (e.g., update state, close modal, etc.)
      } else {
        console.error('Error uploading file:', result.error);
        setErrors({ upload: result.error || 'Failed to upload the file.' });
      }
    } catch (error) {
      console.error('Unexpected error uploading file:', error);
      setErrors({ upload: 'An unexpected error occurred. Please try again.' });
    }
  };

  // Add new file
  const handleAddFile = event => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFiles([{ id: Date.now(), name: newFile.name, file: newFile }]);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  // Trigger the delete confirmation popup
  const handleDeleteFile = async file => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  // Delete the file after confirmation
  const handleConfirmDelete = async () => {
    if (fileToDelete?.path) {
      const filePath = fileToDelete.path;
      console.log('Deleting file with path:', filePath);
      try {
        const result = await devisStorageService.deleteDevisFile(filePath);

        if (result.success) {
          console.log('File deleted successfully');
          setFiles(prevFiles => prevFiles.filter(item => item.path !== filePath)); // Remove file from the UI
        } else {
          console.error('Error deleting file:', result.error);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    handleCloseModal();
  };

  // Download a file
  const handleDownloadFile = async file => {
    try {
      if (!file?.path) {
        console.error('File path is required for download');
        return;
      }
      // Construct the full file path that works in Postman (match the correct format)
      const filePath = file.path;
      console.log('Downloading file from:', filePath);

      // Call the API to download the file using the correct path
      const result = await devisStorageService.downlaodDevisFile(filePath);

      if (result.success) {
        const blob = new Blob([result.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = file.name; // The name for the downloaded file
        link.click();
      } else {
        console.error('Error downloading file:', result.error);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <Typography variant="h6" gutterBottom align="center">
          Fichiers du Devis
        </Typography>
        {/* List of files */}
        <div className={styles.fileList}>
          {loading && <p>Loading files...</p>}
          {!loading &&
            files.map(file => (
              <div key={file.id} className={styles.fileItem}>
                <span>{file.name}</span>
                <div>
                  <MDButton
                    onClick={() => handleDownloadFile(file)}
                    variant="gradient"
                    color="success"
                    size="small"
                  >
                    Télécharger
                  </MDButton>
                  <MDButton
                    onClick={() => handleDeleteFile(file)}
                    variant="gradient"
                    color="error"
                    size="small"
                    style={{ marginLeft: '10px' }}
                  >
                    Supprimer
                  </MDButton>
                </div>
              </div>
            ))}
          {!loading && files.length === 0 && <p>Aucun fichier disponible.</p>}
        </div>
        {/* Add a new file */}
        <div className={styles.addFile}>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleAddFile}
          />
          <label htmlFor="file-upload">
            <MDButton variant="gradient" color="dark" component="span">
              Ajouter un nouveau fichier
            </MDButton>
          </label>
        </div>
        {/* Form buttons */}
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Enregistrer
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <WarningPopUp
          message={DeleteMessage}
          onConfirm={handleConfirmDelete}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};
devisStorageModal.propTypes = {
  devisId: PropTypes.number,
  fetchFiles: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default devisStorageModal;
