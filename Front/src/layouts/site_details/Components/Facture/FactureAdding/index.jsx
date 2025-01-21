/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl, Switch, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import SiteDevisService from 'services/site_details/Devis/DevisService';

const FactureAddingModal = ({ Sid, facture = {}, onSave }) => {
  const [formData, setFormData] = useState({
    ...(facture || {}),
  });
  const [errors, setErrors] = useState({});
  const [activeDevis, setActiveDevis] = useState([]);
  const [isActive, setIsActive] = useState(facture?.is_active ?? true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchActiveDevis = async () => {
      try {
        const result = await SiteDevisService.getActiveDevis(Sid);
        if (result.success && Array.isArray(result.data)) {
          setActiveDevis(result.data);
        } else {
          console.error('Error fetching active devis:', result.error || 'Invalid data structure');
          setActiveDevis([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.facturesage);
        setActiveDevis([]);
      }
    };
    fetchActiveDevis();
  }, [Sid]);

  const validateForm = () => {
    const newErrors = {};
    // Add form validation here
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const factureData = {
      no_fac: formData.no_fac,
      Dfk: formData.Dfk,
      facture_date: formData.facture_date,
      montant_ht: formData.montant_ht,
      montant_ttc: formData.montant_ttc,
      tva: formData.tva,
      is_active: isActive,
    };
    console.log('facture data :', factureData);
    onSave({ Sid, factureData });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="Dfk"
              value={formData.Dfk || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir Devis --
              </MenuItem>
              {activeDevis.length > 0 ? (
                activeDevis.map(devis => (
                  <MenuItem key={devis.Tid} value={devis.Tid}>
                    {devis.Tid}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active devis available</MenuItem>
              )}
            </Select>
          </FormControl>
          <MDInput
            name="no_fac"
            value={formData.no_fac || ''}
            onChange={handleChange}
            placeholder="No facture"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          {/* Date pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Facture date"
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
            />
          </LocalizationProvider>
          <MDInput
            name="montant_ht"
            value={formData.montant_ht || ''}
            onChange={handleChange}
            placeholder="Montant HT"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="tva"
            value={formData.tva || ''}
            onChange={handleChange}
            placeholder="TVA"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="montant_ttc"
            value={formData.montant_ttc || ''}
            onChange={handleChange}
            placeholder="Montant TTC"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
        </div>
        <div className={styles.switchContainer}>
          <div className={styles.switchItem}>
            <InputLabel>Active</InputLabel>
            <Switch checked={isActive} onChange={handleToggleActive} />
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <MDButton onClick={handleSubmit} variant="gradient" color="dark">
          Creer
        </MDButton>
      </div>
    </div>
  );
};
FactureAddingModal.propTypes = {
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
};

FactureAddingModal.defaultProps = {
  facture: {},
};
export default FactureAddingModal;
