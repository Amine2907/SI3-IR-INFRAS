import React, { useState } from 'react';
import styles from './index.module.css';
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
          {company ? 'Modifier Company' : 'Ajouter Company'}
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
          name="site_web"
          value={formData.site_web || ''}
          onChange={handleChange}
          placeholder="Site Web"
          style={{ marginBottom: '5px', width: '320px' }}
        />
        <MDInput
          name="siret"
          value={formData.siret || ''}
          onChange={handleChange}
          placeholder="Siret"
          style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
        />
        <FormControl style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
          <InputLabel id="department-label">Départements</InputLabel>
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
          <label>{isActive ? 'Active' : 'Inactive'}</label>
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
    department: PropTypes.arrayOf(PropTypes.string),
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default CompanyModal;
