/**
 * This component renders a modal to edit or add a company.
 *
 * It contains a form with the company's name, email, phone, and mobile.
 * When the form is submitted, it sends the data to the backend and then
 * calls the onSave callback with the result.
 *
 * It also renders a toggle to activate or desactivate the company.
 *
 * If the company is in the state, it renders a close button.
 *
 * @param {Object} company the company to edit, if any
 * @param {Function} onSave the callback when the form is submitted
 * @param {Function} onClose the callback when the close button is clicked
 */
import React, { useState } from 'react';
import styles from './index.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch } from '@mui/material';
const CompanyModal = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState(company || {});
  const [isActive, setIsActive] = useState(company ? company.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    // if (!formData.prenom) newErrors.prenom = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (company) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {company ? 'Modifier company' : 'Ajouter company'}
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
          name="Site Web"
          value={formData.site_web || ''}
          onChange={handleChange}
          placeholder="Site Web"
          style={{
            marginBottom: '5px',
            width: '320px',
            borderColor: errors.prenom ? 'red' : '',
          }}
          required
        />
        <MDInput
          name="SIRET"
          value={formData.siret || ''}
          onChange={handleChange}
          placeholder="Siret"
          style={{ marginBottom: '5px', width: '320px' }}
        ></MDInput>
        <MDInput
          name="Départements"
          value={formData.department || ''}
          onChange={handleChange}
          placeholder="Départements"
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
CompanyModal.propTypes = {
  company: PropTypes.shape({
    nom: PropTypes.string,
    site_web: PropTypes.string,
    siret: PropTypes.string,
    department: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default CompanyModal;
