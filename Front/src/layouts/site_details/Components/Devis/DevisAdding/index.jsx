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
const DevisAddingModal = ({ Sid, devis, onSave }) => {
  const [formData, setFormData] = useState(devis || { type_devis: '' });
  const [errors, setErrors] = useState({});
  const [activeFrns, setActiveFrns] = useState([]);
  const [activeDemracs, setActiveDemracs] = useState([]);
  const [isActive, setIsActive] = useState(devis ? devis.is_active : true);
  const [isConforme, setIsConforme] = useState(devis ? devis.conformite : true);
  const [isValide, setIsValide] = useState(devis ? devis.valide_par_SFR : true);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const updatedData = { ...prevData, [name]: value };
      console.log('Updated Data:', updatedData);
      return updatedData;
    });
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
  const handleFoursChange = event => {
    setActiveFrns(event.target.value);
  };
  const handleDemracChange = event => {
    setActiveDemracs(event.target.value);
  };

  useEffect(() => {
    if (devis) {
      setFormData(prevData => ({
        ...prevData,
        ...devis,
      }));
      setIsActive(devis.is_active);
      setIsConforme(devis.conformite);
      setIsValide(devis.valide_par_SFR);
    }
  }, [devis]);
  // get Active Fournisseurs for dropdown
  useEffect(() => {
    const fetchActiveFrns = async () => {
      try {
        const result = await SiteDevisService.getActiveFrnsForDevis(Sid);
        if (result.success) {
          setActiveFrns(result.data);
        } else {
          console.error('Error fetching active fournisseurs :', result.error);
          setActiveFrns([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveFrns([]);
      }
    };

    fetchActiveFrns();
  }, [Sid]);
  // get Active Demandes de raccordements for dropodwn
  useEffect(() => {
    const fetchActiveDemracs = async () => {
      try {
        const result = await SiteDemracService.getActiveDemracForSite(Sid);
        if (result.success) {
          setActiveDemracs(result.data);
        } else {
          console.error('Error fetching active dem racs:', result.error);
          setActiveDemracs([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDemracs([]);
      }
    };
    fetchActiveDemracs();
  }, [Sid]);
  const handleSubmit = () => {
    const newErrors = {};
    // if (!formData.type_devis) newErrors.type_devis = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const devisData = {
      no_devis: formData.no_devis,
      fournisseur: formData.fournisseur,
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
      is_active: isActive,
      conformite: isConforme,
      valide_par_SFR: isValide,
    };
    console.log('devis data:', devisData);
    onSave({ Sid, devisData });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <MDInput
            name="no_devis"
            value={formData.no_devis || ''}
            onChange={handleChange}
            placeholder="N de devis"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
            <Select
              name="fournisseur"
              value={formData.fournisseur || ''}
              onChange={handleFoursChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir le fournisseur --
              </MenuItem>
              {activeFrns.map(fournisseur => (
                <MenuItem key={fournisseur.id} value={fournisseur.nom}>
                  {fournisseur.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
            <Select
              name="no_dr"
              value={formData.no_dr || ''}
              onChange={handleDemracChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir le DR --
              </MenuItem>
              {activeDemracs.map(demrac => (
                <MenuItem key={demrac.id} value={demrac.nom}>
                  {demrac.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
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
              label="devis_date "
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
              label="Date d'expiration de devis"
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
              label="Date de reception de devis"
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
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
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
            <label>{isActive ? 'Active' : 'Inactive'}</label>
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
            Creer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
DevisAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  devis: PropTypes.shape({
    no_devis: PropTypes.number,
    fournisseur: PropTypes.string,
    no_dr: PropTypes.number,
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
};
export default DevisAddingModal;
