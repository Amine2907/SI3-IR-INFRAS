/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import MDButton from 'components/MDButton';
import Typography from '@mui/material/Typography';
const ProspectStorageModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(prospect || {});
  const [files, setFiles] = useState([]); // List of files
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // const response = await prospectStorageService.generateprospectSignedUrl();
        if (response.success) {
          setFiles(
            response.data.map(file => ({
              id: file.id,
              name: file.name,
              url: file.signedUrl,
            }))
          );
        } else {
          console.error('Error fetching prospect files:', response.error);
        }
      } catch (error) {
        console.error('Error fetching prospect files:', error);
      }
    };
    fetchFiles();
  }, []);
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  // Submit form
  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (files.length === 0) {
      setErrors({ ...newErrors, file: 'Please upload a file' });
      return;
    }
    const file = files[0]; // Get the first file from the files array
    // Call the uploadprospect function
    // const result = await prospectStorageService.uploadprospect(file);
    if (result.success) {
      // Handle successful upload
      console.log('File uploaded successfully:', result.data);
    } else {
      // Handle failed upload
      console.error('Error uploading file:', result.error);
    }
  };
  // Add new file
  const handleAddFile = event => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFiles([{ id: Date.now(), name: newFile.name, url: URL.createObjectURL(newFile) }]);
    }
  };
  // Download a file
  const handleDownloadFile = file => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };
  // Delete a file
  const handleDeleteFile = fileId => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <Typography variant="h6" gutterBottom align="center">
          Prosoect Fichier
        </Typography>
        {/* List of files */}
        <div className={styles.fileList}>
          {files.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <span>{file.name}</span>
              <div>
                <MDButton
                  onClick={() => handleDownloadFile(file)}
                  variant="gradient"
                  color="success"
                  size="small"
                >
                  Enregistrer
                </MDButton>
                <MDButton
                  onClick={() => handleDeleteFile(file.id)}
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
          {files.length === 0 && <p>No files available. Fetch or add files.</p>}
        </div>
        <div className={styles.addFile}>
          <input
            id="file-upload"
            type="file"
            style={{ display: 'none' }}
            onChange={handleAddFile}
          />
          <label htmlFor="file-upload">
            <MDButton variant="gradient" color="dark" component="span">
              Ajouter un neauveau fichier
            </MDButton>
          </label>
        </div>
        {/* Form buttons */}
        <div className={styles.buttonContainer}>
          <MDButton onClick={onSave} variant="gradient" color="dark">
            Enregistrer
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
ProspectStorageModal.propTypes = {
  prospect: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProspectStorageModal;
