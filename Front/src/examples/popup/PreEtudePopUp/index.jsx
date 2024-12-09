import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { Label } from '@radix-ui/react-label';
const PreEtModal = ({ preEtude, onSave, onClose }) => {
  const [formData, setFormData] = useState(preEtude || {});
  const [isActive, setIsActive] = useState(preEtude ? preEtude.is_active : true);
  const [errors, setErrors] = useState({});
  const handleChange = event => {
    const { name, value } = event.target;
    console.log('Form input change:', name, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (preEtude) {
      setFormData(prevData => ({
        ...prevData,
        ...preEtude,
      }));
      setIsActive(preEtude.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [preEtude]);
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    console.log('handleSubmit called');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log('Validation errors:', newErrors);
      return;
    }
    console.log('Submitting form data:', {
      ...formData,
      is_active: isActive,
    });
    onSave({ ...formData, is_active: isActive });
  };
  const handleToggleActive = () => {
    if (preEtude) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier PreEtude
        </MDTypography>
        <div className={styles.formGrid}>
          <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="type_rac"
              value={formData.type_rac || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.type_rac ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir l&apos;etat prerequis --
              </MenuItem>
              <MenuItem value="Complet">Complet</MenuItem>
              <MenuItem value="Incomplet">Incomplet</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="type_rac"
              value={formData.type_rac || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.type_rac ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Type de raccordement --
              </MenuItem>
              <MenuItem value="Complet">Simple</MenuItem>
              <MenuItem value="Incomplet">Complexe</MenuItem>
            </Select>
          </FormControl>
          <MDInput
            name="MM"
            value={formData.MM || ''}
            onChange={handleChange}
            placeholder="Moyenne metres"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.MM ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="MM"
            value={formData.MM || ''}
            onChange={handleChange}
            placeholder="Moyenne metres"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.MM ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="ZFA_ZFB"
              value={formData.ZFA || formData.ZFB || ''}
              onChange={e => {
                const value = e.target.value;
                // Set numeric values: 1 for ZFA, 2 for ZFB
                setFormData(prevData => ({
                  ...prevData,
                  ZFA: value === 'ZFA' ? 1 : null, // Set 1 for ZFA, else null
                  ZFB: value === 'ZFB' ? 2 : null, // Set 2 for ZFB, else null
                }));
              }}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.ZFA_ZFB ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir ZFA/ZFB --
              </MenuItem>
              <MenuItem value="ZFA">ZFA</MenuItem>
              <MenuItem value="ZFB">ZFB</MenuItem>
            </Select>
          </FormControl>
          <MDInput
            name="CRR"
            value={formData.CRR || ''}
            onChange={handleChange}
            placeholder="Création ou remplacement d'un réseau BT"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRR ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="ADPDT"
            value={formData.ADPDT || ''}
            onChange={handleChange}
            placeholder="Augmentation de puissance du transformateur"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.ADPDT ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="CRRBTA"
            value={formData.CRRBTA || ''}
            onChange={handleChange}
            placeholder="Création réseau BT et augmentation"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRRBTA ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="CRP_HTABT"
            value={formData.CRP_HTABT || ''}
            onChange={handleChange}
            placeholder="Création poste HTA/BT"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRP_HTABT ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="cout"
            value={formData.cout || ''}
            onChange={handleChange}
            placeholder="Cout"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.cout ? 'red' : '',
            }}
            disabled
          />
        </div>
        <div>
          <Label>{isActive ? 'Active' : 'Inactive'}</Label>
          <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
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
PreEtModal.propTypes = {
  preEtude: PropTypes.shape({
    ADPDT: PropTypes.string,
    CRR: PropTypes.string,
    CRP_HTABT: PropTypes.string,
    MM: PropTypes.string,
    ZFA: PropTypes.string,
    ZFB: PropTypes.string,
    cout: PropTypes.string,
    type_rac: PropTypes.string,
    CRRBTA: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PreEtModal;
