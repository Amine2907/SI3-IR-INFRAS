/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../storage.module.css';
import MDButton from 'components/MDButton';
import Typography from '@mui/material/Typography';
import WarningPopUp from '../userPopUp/WarningPopUp';
import mesStorageService from 'services/site_details/MES/MesStorageService';
import MDAlert from 'components/MDAlert';
const mesStorageModal = ({ Sid, mesId, fetchFiles, onSave, onClose }) => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null); // Track the file to delete
  const DeleteMessage = 'Etes vous sure vous voulez supprimer ce fichier !';

  useEffect(() => {
    const fetchFilesForMes = async () => {
      if (!mesId) {
        console.error('No prospect ID provided.');
        return;
      }
      if (!Sid) {
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

    fetchFilesForMes();
  }, [mesId, fetchFiles]);

  // Submit form to upload a file
  const handleSubmit = async () => {
    const file = files[0]?.file;
    if (!file) {
      setErrors({ file: 'Please upload a file.' });
      return;
    }
    try {
      const result = await mesStorageService.uploadMesFile(file, mesId, Sid);
      if (result.success) {
        setAlert({
          show: true,
          message: 'Fichier ajouté avec succès.',
          type: 'success',
        });
        console.log('File uploaded successfully:', result.data);
        // Handle the successful upload (e.g., update state, close modal, etc.)
      } else {
        console.error('Error uploading file:', result.error);
        setAlert({
          show: true,
          message: result.error || "Échec de l'ajout du fichier.",
          type: 'error',
        });
        setErrors({ upload: result.error || 'Failed to upload the file.' });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        type: 'error',
      });
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
        const result = await mesStorageService.deleteMesFile(filePath);

        if (result.success) {
          console.log('File deleted successfully');
          setAlert({
            show: true,
            message: 'Fichier supprimé avec succès.',
            type: 'success',
          });
          setFiles(prevFiles => prevFiles.filter(item => item.path !== filePath)); // Remove file from the UI
        } else {
          setAlert({
            show: true,
            message: result.error || 'Échec de la suppression du fichier.',
            type: 'error',
          });
          console.error('Error deleting file:', result.error);
        }
      } catch (error) {
        setAlert({
          show: true,
          message: "Une erreur inattendue s'est produite lors de la suppression.",
          type: 'error',
        });
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
      const result = await mesStorageService.downloadMesFile(filePath);

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
          Fichiers du Mise en Service
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
};
mesStorageModal.propTypes = {
  mesId: PropTypes.number,
  Sid: PropTypes.string,
  fetchFiles: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default mesStorageModal;
