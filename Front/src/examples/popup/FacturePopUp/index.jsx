/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from '../largeStyles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import SiteDevisService from 'services/site_details/Devis/DevisService';
const FactureUModal = ({ Sid, facture, onSave, onClose }) => {
  const [formData, setFormData] = useState(facture);
  const [isActive, setIsActive] = useState(facture ? facture.is_active : true);
  const [activeDevis, setActiveDevis] = useState([]);
  const [errors, setErrors] = useState({});
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  };
  useEffect(() => {
    if (facture) {
      setFormData({
        ...facture,
      });
      setIsActive(facture.is_active);
    }
  }, [facture]);
  useEffect(() => {
    const fetchActiveDevis = async () => {
      try {
        const result = await SiteDevisService.getActiveDevis(Sid);
        // Ensure result.success is checked, and data is validated.
        if (result.success && Array.isArray(result.data)) {
          setActiveDevis(result.data); // Valid array
        } else {
          console.error(
            'Error fetching active deviseaux de site:',
            result.error || 'Invalid data structure'
          );
          setActiveDevis([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.facturesage);
        setActiveDevis([]); // Fallback to empty array
      }
    };
    fetchActiveDevis();
  }, [Sid]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.no_fac) {
      newErrors.no_fac = 'Numero Facture est obligatoire';
    }
    if (!formData.Dfk) {
      newErrors.Dfk = 'Numero Devis est obligatoire';
    }
    if (!formData.facture_date) {
      newErrors.facture_date = 'Date de facture est obligatoire';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      ...formData,
      is_active: isActive,
    });
  };
  const handleToggleActive = () => {
    setIsActive(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      is_active: !isActive,
    }));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier facture
        </MDTypography>
        <div className={styles.formGrid}>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <InputLabel id="devis-select-label">Numero devis*</InputLabel>
            <Select
              name="Dfk"
              value={formData.Dfk || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.Dfk ? 'red' : '' }}
              error={errors.Dfk}
            >
              <MenuItem value="" disabled>
                -- Choisir devis --
              </MenuItem>
              {activeDevis.length > 0 ? (
                activeDevis.map(devis => (
                  <MenuItem key={devis.ND} value={devis.ND}>
                    {devis.ND}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Pas de devis actives</MenuItem>
              )}
            </Select>
          </FormControl>
          <MDInput
            name="no_fac"
            value={formData.no_fac || ''}
            label="Numero Fcature*"
            onChange={handleChange}
            placeholder="No Facture"
            style={{ marginBottom: '5px', width: '300px', borderColor: errors.no_fac ? 'red' : '' }}
            error={errors.no_fac}
            required
          />
          {errors.no_fac && <span style={{ color: 'red', fontSize: '12px' }}>{errors.no_fac}</span>}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date facture*"
              name="facture_date"
              value={formData.facture_date ? dayjs(formData.facture_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'facture_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{
                marginBottom: '10px',
                width: '100%',
                borderColor: errors.facture_date ? 'red' : '',
              }}
              error={errors.facture_date}
            />
          </LocalizationProvider>
          <MDInput
            name="montant_ht"
            label="Montant HT"
            value={formData.montant_ht || ''}
            onChange={handleChange}
            placeholder="Montant HT"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="tva"
            label="TVA"
            value={formData.tva || ''}
            onChange={handleChange}
            placeholder="TVA"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="montant_ttc"
            label="Montant TTC"
            value={formData.montant_ttc || ''}
            onChange={handleChange}
            placeholder="Montant TTC"
            style={{ marginBottom: '5px', width: '300px' }}
            error={errors.montant_ttc}
            required
          />
          <div>
            <InputLabel>Active</InputLabel>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
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
FactureUModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  facture: PropTypes.shape({
    no_fac: PropTypes.string,
    Dfk: PropTypes.string,
    facture_date: PropTypes.string,
    montant_ht: PropTypes.string,
    montant_ttc: PropTypes.string,
    tva: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default FactureUModal;
