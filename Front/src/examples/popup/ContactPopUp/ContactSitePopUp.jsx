import React, { useState, useEffect } from 'react';
import styles from '../style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch } from '@mui/material';

const ContactSiteModal = ({ Sid, contact, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    mobile: '',
    mission: '',
    is_active: true,
  });
  const [isActive, setIsActive] = useState(contact ? contact.is_active : true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        nom: contact.nom || '',
        prenom: contact.prenom || '',
        email: contact.email || '',
        tel: contact.tel || '',
        mobile: contact.mobile || '',
        mission: contact.mission || '',
        is_active: contact.is_active !== undefined ? contact.is_active : true,
      });
      setIsActive(contact.is_active !== undefined ? contact.is_active : true);
    }
  }, [contact]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    if (!formData.prenom) newErrors.prenom = true;
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = true;
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const contactData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        tel: formData.tel,
        mobile: formData.mobile,
        mission: formData.mission,
        is_active: isActive,
      };
      // Check contactData before passing to onSave
      console.log('Contact Data:', contactData);
      // Ensure Sid is also passed when calling onSave
      onSave({ Sid, contactData });
      return;
    }

    // Create the contact data object
    const contactData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      tel: formData.tel,
      mobile: formData.mobile,
      mission: formData.mission,
      is_active: isActive,
    };

    // Call the onSave function passed from the parent
    onSave({ Sid, contactData });
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Add Contact
        </MDTypography>
        {/* Input Fields */}
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
        {errors.nom && <p style={{ color: 'red' }}>Nom is required</p>}
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
        {errors.prenom && <p style={{ color: 'red' }}>Prenom is required</p>}

        <MDInput
          name="mission"
          value={formData.mission || ''}
          onChange={handleChange}
          placeholder="Mission"
          style={{ marginBottom: '5px', width: '320px' }}
        />

        <MDInput
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        {errors.email && <p style={{ color: 'red' }}>Please enter a valid email</p>}

        <MDInput
          name="tel"
          value={formData.tel || ''}
          onChange={handleChange}
          placeholder="Téléphone"
          style={{ marginBottom: '5px', width: '320px' }}
        />

        <MDInput
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleChange}
          placeholder="Mobile"
          style={{ marginBottom: '5px', width: '320px' }}
        />

        {/* Switch for Active/Inactive */}
        <div>
          <label>{isActive ? 'Active' : 'Inactive'}</label>
          <Switch checked={isActive} onChange={handleToggleActive} color="primary" />
        </div>

        {/* Action Buttons */}
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
// PropTypes for contact and functions
ContactSiteModal.propTypes = {
  Sid: PropTypes.string.isRequired,
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

export default ContactSiteModal;
