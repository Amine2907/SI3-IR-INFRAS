import React, { useState } from 'react';
import styles from './ContactPopUp.module.css';
import PropTypes from 'prop-types';
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
        <h3>{contact ? 'Edit Contact' : 'Add Contact'}</h3>
        <input name="nom" value={formData.nom || ''} onChange={handleChange} placeholder="Nom" />
        <input
          name="prenom"
          value={formData.prenom || ''}
          onChange={handleChange}
          placeholder="Prenom"
        />
        <input
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="telephone"
          value={formData.telephone || ''}
          onChange={handleChange}
          placeholder="Téléphone"
        />
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
ContactModal.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ContactModal;
