/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import MDButton from 'components/MDButton';
import Typography from '@mui/material/Typography';
const ProspectStorageModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(prospect || {});
  const [files, setFiles] = useState([]); // List of files
  const [errors, setErrors] = useState({});
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    return newErrors;
  };
  // Submit form
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData });
  };
  // Add new file
  const handleAddFile = event => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFiles(prevFiles => [
        ...prevFiles,
        { id: Date.now(), name: newFile.name, url: URL.createObjectURL(newFile) },
      ]);
    }
  };
  const handleDownloadFile = file => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };
  const handleDeleteFile = fileId => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <Typography variant="h6" gutterBottom align="center">
          Prospect Fichiers
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
                  Download
                </MDButton>
                <MDButton
                  onClick={() => handleDeleteFile(file.id)}
                  variant="gradient"
                  color="error"
                  size="small"
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </MDButton>
              </div>
            </div>
          ))}
          {files.length === 0 && <p>No files available. Fetch or add files.</p>}
        </div>
        {/* Button to add a new file */}
        <div className={styles.addFile}>
          <input
            id="file-upload-prospect"
            type="file"
            style={{ display: 'none' }}
            onChange={handleAddFile}
          />
          <label htmlFor="file-upload-prospect">
            <MDButton variant="gradient" color="dark" component="span">
              Ajouter un neauveau fichier
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
    </div>
  );
};
ProspectStorageModal.propTypes = {
  prospect: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProspectStorageModal;
