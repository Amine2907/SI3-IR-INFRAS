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

const ReglAddingModal = ({ Sid, paiement = {}, onSave }) => {
  const [formData, setFormData] = useState({
    no_devis: '',
    reglement_date: '',
    no_virement: '',
    nom_acteur: '',
    libelle_du_virement: '',
    montant: '',
    no_commande: '',
    ...paiement,
  });
  const [errors, setErrors] = useState({});
  const [activeDevis, setActiveDevis] = useState([]);
  const [isActive, setIsActive] = useState(paiement.is_active ?? true);
  const [isPartiel, setisPartiel] = useState(paiement.paiement_partiel ?? true);

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

  const validateForm = () => {
    const newErrors = {};
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
      reglement_date: formData.reglement_date,
      no_virement: formData.no_virement,
      nom_acteur: formData.nom_acteur,
      libelle_du_virement: formData.libelle_du_virement,
      montant: formData.montant,
      no_commande: formData.no_commande,
      is_active: isActive,
      paiement_partiel: isPartiel,
    };
    console.log('paiement data :', paiementData);
    onSave({ Sid, devis_fk: formData.no_devis, paiementData });
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
            placeholder="No commande"
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
        </div>
        <div className={styles.switchContainer}>
          <div className={styles.switchItem}>
            <InputLabel>Active</InputLabel>
            <Switch checked={isActive} onChange={handleToggleActive} />
            <div className={styles.switchItem}>
              <InputLabel>Paiement partiel</InputLabel>
              <Switch checked={isPartiel} onChange={handleTogglePaie} />
            </div>
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
    reglement_date: PropTypes.string,
    no_virement: PropTypes.string,
    nom_acteur: PropTypes.string,
    libelle_du_virement: PropTypes.string,
    montant: PropTypes.string,
    no_commande: PropTypes.string,
    is_active: PropTypes.bool,
    paiement_partiel: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};
export default ReglAddingModal;
