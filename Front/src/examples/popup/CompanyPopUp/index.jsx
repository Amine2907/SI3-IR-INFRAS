/**
 * CompanyModal component
 *
 * This component renders a modal window to add or edit a company.
 * It displays input fields for name, site web, siret, and department.
 * There is also a switch to toggle the company's active status.
 * The component accepts three props: company (the company object to edit), onSave (callback to save the company), and onClose (callback to close the modal).
 * The component uses Material UI components for styling and layout.
 *
 * @param {Object} company - The company object to edit.
 * @param {Function} onSave - Callback to save the company.
 * @param {Function} onClose - Callback to close the modal.
 * @returns {ReactElement} The CompanyModal React element.
 */
import React, { useState } from 'react';
import styles from '../style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

// Department options for the multi-select
const DEPARTMENTS = [
  'Étude Prix',
  'RH',
  'Direction',
  'Contrôle De Gestion',
  'Informatique',
  'Conception',
  'Énergie',
  'Finance',
];
const CompanyModal = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState(company || {});
  const [isActive, setIsActive] = useState(company ? company.is_active : true);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = e => {
    const value = e.target.value;
    setFormData({ ...formData, department: value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;

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
          {company ? 'Modifier Entreprise' : 'Ajouter Entreprise'}
        </MDTypography>
        <label className={styles.formLabel}>Nom d&apos;Entreprise</label>
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
        <label className={styles.formLabel}>Site Web</label>
        <MDInput
          name="site_web"
          value={formData.site_web || ''}
          onChange={handleChange}
          placeholder="Site Web"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <label className={styles.formLabel}>SIRET</label>
        <MDInput
          name="siret"
          value={formData.siret || ''}
          onChange={handleChange}
          placeholder="Siret"
          style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
        />
        <label className={styles.formLabel}>Départements</label>
        <FormControl style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
          <Select
            labelId="department-label"
            name="department"
            multiple
            value={formData.department || []}
            onChange={handleDepartmentChange}
            renderValue={selected => selected.join(', ')}
            style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
          >
            {DEPARTMENTS.map(dept => (
              <MenuItem
                key={dept}
                value={dept}
                style={{ display: 'flex', alignItems: 'center' }}
                className={styles.checkboxContainer}
              >
                <input
                  type="checkbox"
                  checked={formData.department && formData.department.includes(dept)}
                  readOnly
                  style={{ marginRight: '100px', cursor: 'pointer' }}
                />
                <MDTypography variant="body2">{dept}</MDTypography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <InputLabel>Active</InputLabel>
          <Switch checked={isActive} onChange={handleToggleActive} />
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
          Fermer
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
    department: PropTypes.arrayOf(PropTypes.string),
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default CompanyModal;
