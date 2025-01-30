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
const PaieUModal = ({ Sid, paiement, onSave, onClose }) => {
  const [formData, setFormData] = useState(paiement);
  const [isActive, setIsActive] = useState(paiement ? paiement.is_active : true);
  const [isPartiel, setIsPartiel] = useState(paiement ? paiement.paiement_partiel : true);
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
    if (paiement) {
      setFormData({
        ...paiement,
      });
      setIsActive(paiement.is_active);
      setIsPartiel(paiement.paiement_partiel);
    }
  }, [paiement]);
  useEffect(() => {
    const fetchActiveDevis = async () => {
      try {
        const result = await SiteDevisService.getDevisSite(Sid);
        if (result.success && Array.isArray(result.data)) {
          setActiveDevis(result.data);
        } else {
          console.error('Error fetching active devis:', result.error || 'Invalid data structure');
          setActiveDevis([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDevis([]);
      }
    };
    fetchActiveDevis();
  }, [Sid]);
  const handleDropdownChange = (field, subField, value) => {
    console.log(`Updating ${field}.${subField} with value:`, value); // Debug log
    // Ensure `formData[field]` exists before accessing sub-properties
    setFormData({
      ...formData,
      [field]: { ...(formData[field] || {}), [subField]: value },
    });
  };
  const validateForm = () => {
    const newErrors = {};
    // if (formData.type_rac === 'Complexe' && !formData.ZFA_ZFB) newErrors.ZFA_ZFB = true;
    // if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log('demRac data :', paiementData);
      onSave({
        Sid,
        ...formData,
        is_active: isActive,
        paiement_partiel: isPartiel,
      });
      return;
    }
    onSave({
      ...formData,
      is_active: isActive,
      paiement_partiel: isPartiel,
    });
  };
  const handleToggleActive = () => {
    setIsActive(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      is_active: !isActive,
    }));
  };
  const handleTogglePaie = () => {
    setIsPartiel(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      paiement_partiel: !isPartiel,
    }));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier paiement
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="no_virement"
            value={formData.no_virement || ''}
            onChange={handleChange}
            placeholder="No virement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="no_devis"
              value={formData.no_devis || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir le Devis --
              </MenuItem>
              {activeDevis.length > 0 ? (
                activeDevis.map(devis => (
                  <MenuItem key={devis.id} value={devis.ND}>
                    {devis.ND}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active devis available</MenuItem>
              )}
            </Select>
          </FormControl>
          <MDInput
            name="nom_acteur"
            value={formData.nom_acteur || ''}
            onChange={handleChange}
            placeholder="Nom Acteur"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="libelle_du_virement"
            value={formData.libelle_du_virement || ''}
            onChange={handleChange}
            placeholder="Libelle de virement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="montant"
            value={formData.montant || ''}
            onChange={handleChange}
            placeholder="Montant (TTC)"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="no_commande"
            value={formData.no_commande || ''}
            onChange={handleChange}
            placeholder="N commande"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Data de paiement"
              name="reglement_date"
              value={formData.reglement_date ? dayjs(formData.reglement_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'reglement_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <div>
            <InputLabel>Active</InputLabel>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
          </div>
          <div>
            <InputLabel>paiement Partiel</InputLabel>{' '}
            <Switch checked={isPartiel} onChange={handleTogglePaie} />
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
PaieUModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  paiement: PropTypes.shape({
    no_devis: PropTypes.string,
    reglement_date: PropTypes.string,
    no_virement: PropTypes.number,
    nom_acteur: PropTypes.string,
    libelle_du_virement: PropTypes.string,
    is_active: PropTypes.bool,
    paiement_partiel: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PaieUModal;
