/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, Icon } from '@mui/material';
import { Label } from '@radix-ui/react-label';
import SiteDevisService from 'services/site_details/Devis/DevisService';
import SiteDemracService from 'services/site_details/DR/DrService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
const DevisUModal = ({ Sid, devis, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    devis || {
      fournisseur: { nom: '' },
    }
  );
  const [isActive, setIsActive] = useState(devis ? devis.is_active : true);
  const [isConforme, setIsConforme] = useState(devis ? devis.conformite : true);
  const [isValide, setIsValide] = useState(devis ? devis.valide_par_SFR : true);
  const [activeFournisseurs, setActiveFournisseurs] = useState([]);
  const [activeDemracs, setActiveDemracs] = useState([]);
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
    if (devis) {
      setFormData({
        ...devis,
        fournisseur: devis.fournisseur ? devis.fournisseur : { nom: '' },
      });
      setIsActive(devis.is_active);
      setIsConforme(devis.conformite);
      setIsValide(devis.valide_par_SFR);
    }
  }, [devis]);
  const handleDropdownChange = (field, subField, value) => {
    console.log(`Updating ${field}.${subField} with value:`, value); // Debug log
    // Ensure `formData[field]` exists before accessing sub-properties
    setFormData({
      ...formData,
      [field]: { ...(formData[field] || {}), [subField]: value },
    });
  };
  //   fetching active fournisseurs for the site
  const fetchActiveFrns = async () => {
    try {
      // Call the service method to fetch active prospects for the given Sid
      const result = await SiteDevisService.getActiveFrnsForDevis(Sid);
      // Check if the result is successful
      if (result.success) {
        // Set the active prospects data if the response is successful
        setActiveFournisseurs(result.data);
      } else {
        console.error('Error fetching active fournisseurs :', result.error);
        setActiveFournisseurs([]);
      }
    } catch (error) {
      // Handle errors during the fetch
      console.error('Error during fetch:', error.message);
      setActiveFournisseurs([]); // Set an empty array in case of error
    }
  };
  useEffect(() => {
    fetchActiveFrns();
  }, [Sid, devis]);
  //   fetching active demandes de raccordements for the site
  const fetchActiveDemrac = async () => {
    try {
      // Call the service method to fetch active prospects for the given Sid
      const result = await SiteDemracService.getDemRacSite(Sid);
      // Check if the result is successful
      if (result.success) {
        // Set the active prospects data if the response is successful
        setActiveDemracs(result.data);
      } else {
        console.error('Error fetching active fournisseurs :', result.error);
        setActiveDemracs([]);
      }
    } catch (error) {
      // Handle errors during the fetch
      console.error('Error during fetch:', error.message);
      setActiveDemracs([]); // Set an empty array in case of error
    }
  };
  useEffect(() => {
    fetchActiveDemrac();
  }, [Sid, devis]);
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
      console.log('demRac data :', devisData);
      const selectedFournisseur = activeFrns.find(f => f.nom === formData.fournisseur.nom);
      onSave({
        Sid,
        ...formData,
        fournisseur: selectedFournisseur ? selectedFournisseur.id : null,
        is_active: isActive,
        conformite: isConforme,
        valide_par_SFR: isValide,
      });
      return;
    }
    onSave({
      ...formData,
      is_active: isActive,
      conformite: isConforme,
      valide_par_SFR: isValide,
    });
  };
  const handleToggleActive = () => {
    setIsActive(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      is_active: !isActive,
    }));
  };
  const handleToggleConforme = () => {
    setIsConforme(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      conformite: !isConforme,
    }));
  };
  const handleToggleValide = () => {
    setIsValide(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      valide_par_SFR: !isValide,
    }));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier Devis
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="ND"
            value={formData.ND || ''}
            onChange={handleChange}
            placeholder="N de devis"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="fournisseur"
              value={formData.fournisseur.nom || ''}
              onChange={e => handleDropdownChange('fournisseur', 'nom', e.target.value)}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir le fournisseur --
              </MenuItem>
              {activeFournisseurs.map(fournisseur => (
                <MenuItem key={fournisseur.id} value={fournisseur.nom}>
                  {fournisseur.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="no_dr"
              value={formData.no_dr || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir le DR --
              </MenuItem>
              {activeDemracs.map(demrac => (
                <MenuItem key={demrac.id} value={demrac.NDRid}>
                  {demrac.NDRid}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="type_devis"
              value={formData.type_devis}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.type_devis ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le type de devis --
              </MenuItem>
              <MenuItem value="Extension ENEDIS">Extension ENEDIS</MenuItem>
              <MenuItem value="Branchement">Branchement</MenuItem>
              <MenuItem value="Estimatif SYNDICAT">Estimatif SYNDICAT</MenuItem>
              <MenuItem value="Definitif SYNDICAT">Definitif SYNDICAT</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date de devis "
              name="devis_date "
              value={formData.devis_date ? dayjs(formData.devis_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'devis_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <div style={{ position: 'relative', width: '300px' }}>
            <MDInput
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="Montant (TTC) "
              style={{
                marginBottom: '5px',
                width: '100%',
                marginTop: '10px',
                borderColor: errors.montant ? 'red' : '',
              }}
            />
            <Icon
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              euro
            </Icon>
          </div>
          <MDInput
            name="code_postal_lieu"
            value={formData.code_postal_lieu || ''}
            onChange={handleChange}
            placeholder="CP du lieu de Raccordement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="code_paiement"
            value={formData.code_paiement || ''}
            onChange={handleChange}
            placeholder="Code de Paiement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date d'expiration"
              name="expiration_date"
              value={formData.expiration_date ? dayjs(formData.expiration_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'expiration_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date de reception"
              name="reception_date"
              value={formData.reception_date ? dayjs(formData.reception_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'reception_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="etat_ralance"
              value={formData.etat_ralance}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.etat_ralance ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir l&apos;etat de relance --
              </MenuItem>
              <MenuItem value="a relancer">a relancer</MenuItem>
              <MenuItem value="En attente">En attente</MenuItem>
              <MenuItem value="ok">ok</MenuItem>
              <MenuItem value="N/A">N/A</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Derniere relance"
              name="derniere_relance_date"
              value={formData.derniere_relance_date ? dayjs(formData.derniere_relance_date) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'derniere_relance_date',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <div>
            <Label>{isActive ? 'Active' : 'Inactive'}</Label>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
            <label>Conformite</label>
            <Switch type="checkbox" checked={isConforme} onChange={handleToggleConforme}>
              {' '}
              {isActive ? 'Conforme' : 'Non Conforme'}
            </Switch>
            <label>Valide par SFR</label>
            <Switch type="checkbox" checked={isValide} onChange={handleToggleValide}>
              {' '}
              {isActive ? 'Valide par SFR' : 'Non valide par SFR'}
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
DevisUModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  devis: PropTypes.shape({
    ND: PropTypes.number,
    fournisseur: PropTypes.string,
    no_dr: PropTypes.string,
    type_devis: PropTypes.string,
    devis_date: PropTypes.string,
    montant: PropTypes.number,
    code_postal_lieu: PropTypes.string,
    code_paiement: PropTypes.string,
    expiration_date: PropTypes.string,
    reception_date: PropTypes.string,
    etat_ralance: PropTypes.string,
    derniere_relance_date: PropTypes.string,
    is_active: PropTypes.bool,
    conformite: PropTypes.bool,
    valide_par_SFR: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DevisUModal;
