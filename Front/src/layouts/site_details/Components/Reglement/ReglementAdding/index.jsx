/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl, Switch } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import SiteDevisService from 'services/site_details/Devis/DevisService';
const ReglAddingModal = ({ Sid, paiement, onSave }) => {
  const [formData, setFormData] = useState(paiement);
  const [errors, setErrors] = useState({});
  const [activeDevis, setActiveDevis] = useState([]);
  const [isActive, setIsActive] = useState(paiement ? paiement.is_active : true);
  const [isPartiel, setisPartiel] = useState(paiement ? paiement.paiement_partiel : true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  const handleTogglePaie = () => {
    setisPartiel(!isPartiel);
  };
  useEffect(() => {
    if (paiement) {
      setFormData({
        ...paiement,
      });
      setIsActive(paiement.is_active);
      setisPartiel(paiement.paiement_partiel);
    }
  }, [paiement]);
  // get Active devis for dropdown
  useEffect(() => {
    const fecthActiveDevis = async () => {
      try {
        const result = await SiteDevisService.getDevisSite(Sid);
        // Ensure result.success is checked, and data is validated.
        if (result.success && Array.isArray(result.data)) {
          setActiveDevis(result.data); // Valid array
        } else {
          console.error('Error fetching active devis:', result.error || 'Invalid data structure');
          setActiveDevis([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDevis([]); // Fallback to empty array
      }
    };
    fecthActiveDevis();
  }, [Sid]);
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const paiementData = {
      no_devis: formData.no_devis,
      paiement_date: formData.paiement_date,
      no_virement: formData.no_virement,
      nom_acteur: formData.nom_acteur,
      libelle_du_virement: formData.libelle_du_virement,
      is_active: isActive,
      paiement_partiel: isPartiel,
    };
    console.log('paiement data :', paiementData);
    onSave({ Sid, paiementData });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
                -- Choisir le DR --
              </MenuItem>
              {activeDevis.length > 0 ? (
                activeDevis.map(devis => (
                  <MenuItem key={devis.id} value={devis.NDRid}>
                    {devis.NDRid}
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
          <div className={styles.switchItem}>
            <label>paiement Partiel</label>
            <Switch checked={isPartiel} onChange={handleTogglePaie} />
          </div>
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
              name="paiement_date"
              value={formData.paiement_date ? dayjs(formData.paiement_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'paiement_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
        </div>
        <div className={styles.switchContainer}>
          <div className={styles.switchItem}>
            <label>Active</label>
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
ReglAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  paiement: PropTypes.shape({
    no_devis: PropTypes.string,
    paiement_date: PropTypes.string,
    no_virement: PropTypes.number,
    nom_acteur: PropTypes.string,
    libelle_du_virement: PropTypes.string,
    is_active: PropTypes.bool,
    paiement_partiel: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};
export default ReglAddingModal;
