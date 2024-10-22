import React, { useState } from 'react';
import styles from './ContactPopUp.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch } from '@mui/material';
const ContactModal = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState(contact || {});
  const [isActive, setIsActive] = useState(contact ? contact.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    if (!formData.prenom) newErrors.prenom = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (contact) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {contact ? 'Modifier Contact' : 'Ajouter Contact'}
        </MDTypography>
        <MDInput
          name="nom"
          value={formData.nom || ''}
          onChange={handleChange}
          placeholder="Nom*"
          style={{
            marginBottom: '5px',
            width: '320px',
            marginTop: '10px',
            borderColor: errors.nom ? 'red' : '',
          }}
          required
        />
        <MDInput
          name="prenom"
          value={formData.prenom || ''}
          onChange={handleChange}
          placeholder="Prenom*"
          style={{
            marginBottom: '5px',
            width: '320px',
            borderColor: errors.prenom ? 'red' : '',
          }}
          required
        />
        <MDInput
          name="mission"
          value={formData.mission || ''}
          onChange={handleChange}
          placeholder="Mission"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="tel"
          value={formData.tel || ''}
          onChange={handleChange}
          placeholder="Téléphone"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleChange}
          placeholder="mboile"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <div>
          <label>{isActive ? 'Active' : 'Inactive'}</label>
          <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
        </div>
        <MDButton
          onClick={handleSubmit}
          variant="gradient"
          color="dark"
          style={{ marginLeft: '10px', marginTop: '10px' }}
        >
          Save
        </MDButton>
        <MDButton onClick={onClose} variant="gradient" color="dark" style={{ marginLeft: '170px' }}>
          Close
        </MDButton>
      </div>
    </div>
  );
};
ContactModal.propTypes = {
  contact: PropTypes.shape({
    nom: PropTypes.string,
    prenom: PropTypes.string,
    email: PropTypes.string,
    tel: PropTypes.string,
    mobile: PropTypes.string,
    mission: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ContactModal;
