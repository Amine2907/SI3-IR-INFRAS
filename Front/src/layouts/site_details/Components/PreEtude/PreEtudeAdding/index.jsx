/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { Label } from '@radix-ui/react-label';

const PreEtudeAddingModal = ({ Sid, preEtude, onSave }) => {
  const [formData, setFormData] = useState(preEtude || {});
  const [errors, setErrors] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;
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
    if (!formData.ZFA && !formData.ZFB) newErrors.ZFA_ZFB = true;
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const preEtudeData = {
      ADPDT: formData.ADPDT,
      CRR: formData.CRR,
      CRP_HTABT: formData.CRP_HTABT,
      MM: formData.MM,
      MJS: formData.MJS,
      ZFA: formData.ZFA,
      ZFB: formData.ZFB,
      cout: formData.cout,
      type_rac: formData.type_rac,
      CRRBTA: formData.CRRBTA,
    };
    console.log('prospect data :', preEtudeData);
    onSave({ Sid, preEtudeData });
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          {/* Dropdown for Moyenne Metres */}
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
              name="MM"
              value={formData.MM || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.MM ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le prospect --
              </MenuItem>
              <MenuItem value="Complet">Complet</MenuItem>
              <MenuItem value="Incomplet">Incomplet</MenuItem>
            </Select>
          </FormControl>
          {/* Dropdown for Type de Raccordement */}
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
                -- Choisir le type de raccordement --
              </MenuItem>
              <MenuItem value="Simple">Simple</MenuItem>
              <MenuItem value="Complexe">Complexe</MenuItem>
            </Select>
          </FormControl>
          {/* Conditionally render fields if type_rac is "Complexe" */}
          {formData.type_rac === 'Complexe' && (
            <>
              <MDInput
                name="MM"
                value={formData.MM || ''}
                onChange={handleChange}
                placeholder="Moyenne metres"
                style={{
                  marginBottom: '5px',
                  width: '300px',
                  marginTop: '10px',
                }}
                required
              />
              {/* Dropdown for ZFA/ZFB */}
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
                    setFormData(prevData => ({
                      ...prevData,
                      ZFA: value === 'ZFA' ? true : '',
                      ZFB: value === 'ZFB' ? true : '',
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
              {/* Additional Fields */}
              <MDInput
                name="CRR"
                value={formData.CRR || ''}
                onChange={handleChange}
                placeholder="Création ou remplacement d'un réseau BT"
                style={{
                  marginBottom: '5px',
                  width: '300px',
                  marginTop: '10px',
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
                }}
                required
              />
            </>
          )}
        </div>
        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Creer
          </MDButton>
        </div>
      </div>
    </div>
  );
};

PreEtudeAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  preEtude: PropTypes.shape({
    ADPDT: PropTypes.string,
    CRR: PropTypes.string,
    CRP_HTABT: PropTypes.string,
    MM: PropTypes.string,
    MJS: PropTypes.string,
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

export default PreEtudeAddingModal;
