import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, Input } from '@mui/material';
import { statusSfrValues, statusValidationValues } from '../ProspectsPopUp/ProspectData';
const ProsUModal = ({ prospect, onSave, onClose }) => {
  const [formData, setFormData] = useState(prospect || {});
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
      });
      setIsActive(prospect.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [prospect]);
  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!formData.nom) newErrors.nom = true;
  //   if (!formData.latitude) newErrors.latitude = true;
  //   return newErrors;
  // };
  const handleSubmit = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    // if (!formData.prenom) newErrors.prenom = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (prospect) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
          <MDInput
            name="cout_estime"
            value={formData.cout_estime || ''}
            onChange={handleChange}
            placeholder="Cout Estime"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.cout_estime ? 'red' : '',
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
            <MDTypography>Retenu</MDTypography>
            <Input
              type="checkbox"
              checked={formData.retenu}
              readOnly
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
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
