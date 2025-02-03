import React, { useState, useEffect } from 'react';
import styles from '../style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { InputLabel, Switch } from '@mui/material';

const ConatctStaticModal = ({ contact, onClose }) => {
  // Initialize state based on contact prop
  const [formData, setFormData] = useState({});
  const [isActive, setIsActive] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (contact) {
      setFormData(contact); // Set form data
      setIsActive(contact.is_active); // Set active status
    }
  }, [contact]);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Contact
        </MDTypography>
        <label className={styles.formLabel}>Nom</label>
        <MDInput
          name="nom"
          value={formData.nom || ''}
          placeholder="Nom*"
          style={{
            marginBottom: '5px',
            width: '320px',
            marginTop: '10px',
            borderColor: errors.nom ? 'red' : '',
          }}
          required
        />
        <label className={styles.formLabel}>Prenom</label>
        <MDInput
          name="prenom"
          value={formData.prenom || ''}
          placeholder="Prenom*"
          style={{
            marginBottom: '5px',
            width: '320px',
            borderColor: errors.prenom ? 'red' : '',
          }}
          required
        />
        <label className={styles.formLabel}>Mission</label>
        <MDInput
          name="mission"
          value={formData.mission || ''}
          placeholder="Mission"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <label className={styles.formLabel}>Email</label>
        <MDInput
          name="email"
          value={formData.email || ''}
          placeholder="Email"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <label className={styles.formLabel}>Telephone</label>
        <MDInput
          name="tel"
          value={formData.tel || ''}
          placeholder="Téléphone"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <label className={styles.formLabel}>Mobile</label>
        <MDInput
          name="mobile"
          value={formData.mobile || ''}
          placeholder="Mobile"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <div>
          <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
          <Switch checked={isActive} name="is_active" inputProps={{ 'aria-label': 'controlled' }} />
        </div>
        <MDButton onClick={onClose} variant="gradient" color="dark" style={{ marginLeft: '130px' }}>
          Fermer
        </MDButton>
      </div>
    </div>
  );
};
ConatctStaticModal.propTypes = {
  contact: PropTypes.shape({
    nom: PropTypes.string,
    prenom: PropTypes.string,
    email: PropTypes.string,
    tel: PropTypes.string,
    mobile: PropTypes.string,
    mission: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
};
export default ConatctStaticModal;
