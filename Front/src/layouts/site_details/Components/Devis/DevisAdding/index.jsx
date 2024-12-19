import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl, Switch } from '@mui/material';
import SiteDevisService from 'services/site_details/Devis/DevisService';
import SiteDemracService from 'services/site_details/DR/DrService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
const DevisAddingModal = ({ Sid, devis, onSave }) => {
  const [formData, setFormData] = useState(
    devis || {
      fournisseur: { nom: '' },
    }
  );
  const [errors, setErrors] = useState({});
  const [activeFrns, setActiveFrns] = useState([]);
  const [activeDemracs, setActiveDemracs] = useState([]);
  const [isActive, setIsActive] = useState(devis ? devis.is_active : true);
  const [isConforme, setIsConforme] = useState(devis ? devis.conformite : true);
  const [isValide, setIsValide] = useState(devis ? devis.valide_par_SFR : true);

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
  const handleToggleConforme = () => {
    setIsConforme(!isConforme);
  };
  const handleToggleValide = () => {
    setIsValide(!isValide);
  };
  useEffect(() => {
    if (devis) {
      setFormData({
        ...devis,
        fournisseur: devis.fournisseur || { nom: '' },
      });
      setIsActive(devis.is_active);
      setIsConforme(devis.conformite);
      setIsValide(devis.valide_par_SFR);
    }
  }, [devis]);
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
        const result = await SiteDevisService.getActiveFrnsForDevis(Sid);
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
  // get Active Demandes de raccordements for dropodwn
  useEffect(() => {
    const fetchActiveDemracs = async () => {
      try {
        const result = await SiteDemracService.getActiveDemracForSite(Sid);
        // Ensure result.success is checked, and data is validated
        if (result.success && Array.isArray(result.data)) {
          setActiveDemracs(result.data); // Valid array
        } else {
          console.error(
            'Error fetching active dem racs:',
            result.error || 'Invalid data structure'
          );
          setActiveDemracs([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDemracs([]); // Fallback to empty array
      }
    };
    fetchActiveDemracs();
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

    const devisData = {
      ND: formData.ND,
      fournisseur: formData.fournisseur.nom,
      no_dr: formData.no_dr,
      type_devis: formData.type_devis,
      devis_date: formData.devis_date,
      montant: formData.montant,
      code_postal_lieu: formData.code_postal_lieu,
      code_paiement: formData.code_paiement,
      expiration_date: formData.expiration_date,
      reception_date: formData.reception_date,
      etat_ralance: formData.etat_ralance,
      derniere_relance_date: formData.derniere_relance_date,
      section: formData.section,
      parcelle: formData.parcelle,
      numero_DP: formData.numero_DP,
      is_active: isActive,
      conformite: isConforme,
      valide_par_SFR: isValide,
    };
    // Validation checks
    if (devisData.section !== formData.section) {
      throw new Error('Validation failed: Incorrect section provided.');
    }
    if (devisData.parcelle !== formData.parcelle) {
      throw new Error('Validation failed: Incorrect parcelle provided.');
    }
    if (devisData.numero_DP !== formData.numero_DP) {
      throw new Error('Validation failed: Incorrect numero_DP provided.');
    }
    console.log('devis data :', devisData);
    onSave({ Sid, devisData });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
              {activeFrns.length > 0 ? (
                activeFrns.map(fournisseur => (
                  <MenuItem key={fournisseur.id} value={fournisseur.nom}>
                    {fournisseur.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active fournisseurs available</MenuItem>
              )}
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
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="type_devis"
              value={formData.type_devis || ''}
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
          <MDInput
            name="montant"
            value={formData.montant || ''}
            onChange={handleChange}
            placeholder="Montant (TTC) "
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
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
              value={formData.etat_ralance || ''}
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
        </div>
        <div className={styles.switchContainer}>
          <div className={styles.switchItem}>
            <label>Active</label>
            <Switch checked={isActive} onChange={handleToggleActive} />
          </div>
          <div className={styles.switchItem}>
            <label>Conformite</label>
            <Switch checked={isConforme} onChange={handleToggleConforme} />
          </div>
          <div className={styles.switchItem}>
            <label>Valide par SFR</label>
            <Switch checked={isValide} onChange={handleToggleValide} />
          </div>
        </div>
        <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Valdiation Prospect
          </MDTypography>
          <MDBox display="flex" gap={2}></MDBox>
        </MDBox>
        <MDInput
          name="numero_DP"
          value={formData.numero_DP || ''}
          onChange={handleChange}
          placeholder="N DP"
          style={{ marginBottom: '5px', width: '300px' }}
          required
        />
        <MDInput
          name="section"
          value={formData.section || ''}
          onChange={handleChange}
          placeholder="Section"
          style={{ marginBottom: '5px', width: '300px' }}
          required
        />
        <MDInput
          name="parcelle"
          value={formData.parcelle || ''}
          onChange={handleChange}
          placeholder="Parcelle"
          style={{ marginBottom: '5px', width: '300px' }}
          required
        />
      </div>
      <div className={styles.buttonContainer}>
        <MDButton onClick={handleSubmit} variant="gradient" color="dark">
          Creer
        </MDButton>
      </div>
    </div>
  );
};
DevisAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  devis: PropTypes.shape({
    ND: PropTypes.number,
    fournisseur: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
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
    section: PropTypes.string,
    parcelle: PropTypes.string,
    numero_DP: PropTypes.string,
    is_active: PropTypes.bool,
    conformite: PropTypes.bool,
    valide_par_SFR: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};
export default DevisAddingModal;
