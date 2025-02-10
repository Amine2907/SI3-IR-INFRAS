import React, { useState, useEffect } from 'react';
import styles from '../combinedStyles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { statusSfrValues, statusValidationValues } from '../ProspectsPopUp/ProspectData';
import { mapValidationStatus } from './ProsData';
const ProsUModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(prospect || {});
  const [isActive, setIsActive] = useState(prospect ? prospect.is_active : true);
  const [isRetenu, setIsRetenu] = useState(prospect ? prospect.retenu : true);
  const [errors, setErrors] = useState({});
  const handleChange = event => {
    const { name, value } = event.target;
    console.log('Dropdown Change:', { name, value });
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (prospect) {
      setFormData({
        ...prospect,
        status_validation_fk: mapValidationStatus(prospect.status_validation_fk),
      });
      setIsActive(prospect.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [prospect]);
  const validateForm = () => {
    const requiredFields = [
      'nom',
      'section',
      'parcelle',
      'longitude',
      'latitude',
      'status_validation_fk',
    ];

    const newErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field} est obligatoire !`;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    // If there are errors, prevent submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    onSave({ ...formData, is_active: isActive, retenu: isRetenu });
  };
  const handleToggleActive = () => {
    if (prospect) {
      setIsActive(!isActive);
    }
  };
  const handleToggleRetenu = () => {
    console.log('Toggling Retenu:', !isRetenu);
    setIsRetenu(!isRetenu);
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <MDInput
            name="nom"
            label="Nom"
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
          {errors.nom && <p className={styles.errorText}>{errors.nom}</p>}
          <MDInput
            label="Section"
            name="section"
            value={formData.section || ''}
            onChange={handleChange}
            placeholder="Section*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.section ? 'red' : '',
            }}
            required
          />
          {errors.section && <p className={styles.errorText}>{errors.section}</p>}
          <MDInput
            label="Parcelle"
            name="parcelle"
            value={formData.parcelle || ''}
            onChange={handleChange}
            placeholder="Parcelle*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.parcelle ? 'red' : '',
            }}
            required
          />
          {errors.parcelle && <p className={styles.errorText}>{errors.parcelle}</p>}
          <MDInput
            label="Longitude"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            placeholder="longitude*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.longitude ? 'red' : '',
            }}
            required
          />
          {errors.longitude && <p className={styles.errorText}>{errors.longitude}</p>}
          <MDInput
            label="Latitude"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            placeholder="latitude*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.latitude ? 'red' : '',
            }}
            required
          />
          {errors.latitude && <p className={styles.errorText}>{errors.latitude}</p>}
          <MDInput
            label="Cout Estime"
            name="cout_estime"
            value={formData.cout_estime || ''}
            onChange={handleChange}
            placeholder="Cout Estime"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
            }}
            required
          />
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Status Validation</InputLabel>
            <Select
              name="status_validation_fk"
              value={formData.status_validation_fk || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.status_validation_fk ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le status validation* --
              </MenuItem>
              {statusValidationValues.map(status => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.status_validation_fk && (
            <p className={styles.errorText}>{errors.status_validation_fk}</p>
          )}
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <InputLabel id="devis-select-label">Status site SFR</InputLabel>
            <Select
              name="status_site_sfr"
              value={formData.status_site_sfr || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
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
            <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
            <InputLabel>{isRetenu ? 'Retenu' : 'Non Retenu'}</InputLabel>
            <Switch type="checkbox" checked={isRetenu} onChange={handleToggleRetenu}>
              {isRetenu ? 'Retenu' : 'Non Retenu'}
            </Switch>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            modifier
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
ProsUModal.propTypes = {
  prospect: PropTypes.shape({
    nom: PropTypes.string,
    section: PropTypes.string,
    parcelle: PropTypes.string,
    longitude: PropTypes.string,
    latitude: PropTypes.string,
    cout_estime: PropTypes.string,
    status_validation_fk: PropTypes.string,
    status_site_sfr: PropTypes.string,
    is_active: PropTypes.bool,
    retenu: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default ProsUModal;
