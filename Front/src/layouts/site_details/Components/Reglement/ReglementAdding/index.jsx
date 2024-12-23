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
const ReglAddingModal = ({ Sid, paiement, onSave }) => {
  const [formData, setFormData] = useState(paiement);
  const [errors, setErrors] = useState({});
  const [activeFrns, setActiveFrns] = useState([]);
  const [activeDemracs, setActiveDemracs] = useState([]);
  const [isActive, setIsActive] = useState(paiement ? paiement.is_active : true);
  const [isPartiel, setisPartiel] = useState(paiement ? paiement.paiement_partiel : true);

  const handleChange = e => {
    const { name, value } = e.target;
    // Special handling for nested fields
    if (name === 'fournisseur') {
      setFormData({ ...formData, fournisseur: { nom: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
        // fournisseur: paiement.fournisseur || { nom: '' },
      });
      setIsActive(paiement.is_active);
      setisPartiel(paiement.paiement_partiel);
    }
  }, [paiement]);
  const handleDropdownChange = (field, subField, value) => {
    console.log(`Updating ${field}.${subField} with value:`, value); // Debug log
    setFormData({
      ...formData,
      [field]: { [subField]: value },
    });
  };
  // get Active Fournisseurs for dropdown
  useEffect(() => {
    const fetchActiveFrns = async () => {
      try {
        const result = await SitepaiementService.getActiveFrnsForpaiement(Sid);
        // Ensure result.success is checked, and data is validated.
        if (result.success && Array.isArray(result.data)) {
          setActiveFrns(result.data); // Valid array
        } else {
          console.error(
            'Error fetching active fournisseurs:',
            result.error || 'Invalid data structure'
          );
          setActiveFrns([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveFrns([]); // Fallback to empty array
      }
    };
    fetchActiveFrns();
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
      No_virement: formData.No_virement,
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
            name="No_virement"
            value={formData.No_virement || ''}
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
              {activeDemracs.length > 0 ? (
                activeDemracs.map(demrac => (
                  <MenuItem key={demrac.id} value={demrac.NDRid}>
                    {demrac.NDRid}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active drs available</MenuItem>
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
    No_virement: PropTypes.number,
    nom_acteur: PropTypes.string,
    libelle_du_virement: PropTypes.string,
    is_active: PropTypes.bool,
    paiement_partiel: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};
export default ReglAddingModal;
