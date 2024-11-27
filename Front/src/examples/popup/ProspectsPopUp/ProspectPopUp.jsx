import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { statusSfrValues, statusValidationValues } from './ProspectData';
const ProspectModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    prospect || {
      nom: '',
      section: '',
      parcelle: '',
      longitude: '',
      latitude: '',
      status_validation_fk: { SV_desc: '' },
      status_site_sfr: '',
      retenu: false,
    }
  );
  const [isActive, setIsActive] = useState(prospect ? prospect.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (prospect) {
      setFormData({
        ...prospect,
        status_validation_fk: prospect.status_validation_fk || { SV_desc: '' },
      });
      setIsActive(prospect.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [prospect]);
  const handleSubmit = () => {
    const newErrors = {};
    console.log('Validation errors:', newErrors);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log('Form data submitted:', formData);
    onSave({
      ...formData,
      is_active: isActive,
    });
  };
  const handleToggleActive = () => {
    if (prospect) {
      setIsActive(!isActive);
    }
  };
  const handleDropdownChange = (field, subField, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: {
        ...prevFormData[field],
        [subField]: value,
      },
    }));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {prospect ? 'Modifier prospect' : 'Ajouter prospect'}
        </MDTypography>
        <div className={styles.formGrid}>
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
            name="section"
            value={formData.section || ''}
            onChange={handleChange}
            placeholder="Section*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="parcelle"
            value={formData.parcelle || ''}
            onChange={handleChange}
            placeholder="Parcelle*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            placeholder="longitude*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            placeholder="latitude*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="status_validation_fk"
              value={formData.status_validation_fk?.SV_desc || ''}
              onChange={e =>
                handleDropdownChange('status_validation_fk', 'SV_desc', e.target.value)
              }
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.status_validation_fk ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le status validation --
              </MenuItem>
              {statusValidationValues.map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="status_site_sfr"
              value={formData.status_site_sfr || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                --Choisir le status de site SFR--
              </MenuItem>
              {statusSfrValues.map((status, index) => (
                <MenuItem key={index} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <label>{isActive ? 'Active' : 'Inactive'}</label>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
            <input
              type="checkbox"
              checked={formData.retenu}
              readOnly
              style={{ marginRight: '100px', cursor: 'pointer' }}
            />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Save
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
ProspectModal.propTypes = {
  prospect: PropTypes.shape({
    nom: PropTypes.string,
    section: PropTypes.string,
    parcelle: PropTypes.string,
    longitude: PropTypes.string,
    latitude: PropTypes.string,
    status_validation_fk: PropTypes.shape({
      SV_desc: PropTypes.string.isRequired,
    }).isRequired,
    is_active: PropTypes.bool,
    retenu: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProspectModal;
