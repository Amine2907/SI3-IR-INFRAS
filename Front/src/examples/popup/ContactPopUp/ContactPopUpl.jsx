import React, { useState } from 'react';
import styles from './ContactPopUp.module.css'; // Ensure styles are applied correctly
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
const ContactModal = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState(contact || {});

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium">
          {contact ? 'Edit Contact' : 'Add Contact'}
        </MDTypography>
        <input name="nom" value={formData.nom || ''} onChange={handleChange} placeholder="Nom" />
        <input
          name="prenom"
          value={formData.prenom || ''}
          onChange={handleChange}
          placeholder="Prenom"
        />
        <input
          name="mission"
          value={formData.mission || ''}
          onChange={handleChange}
          placeholder="Mission"
        />
        <input
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="telephone"
          value={formData.tel || ''}
          onChange={handleChange}
          placeholder="Téléphone"
        />
        <input
          name="mobile"
          value={formData.mobile || ''}
          onChange={handleChange}
          placeholder="mboile"
        />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Close</button>
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
