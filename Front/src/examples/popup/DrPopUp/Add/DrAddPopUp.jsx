/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from '../styles.module.css';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SiteDemracService from 'services/site_details/DR/DrService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
const DrAddModal = ({ Sid, demrac, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    demrac || {
      SPRid_FK: { SPR_desc: '' },
      gestionnaire_de_reseau: { nom: '' },
      Pro_fk: { nom: '' },
      no_devis: { ND: '' },
    }
  );
  const [activeDevis, setActiveDevis] = useState([]);
  const [activeProspects, setActivePropescts] = useState([]);
  const [activeEntites, setActiveEntites] = useState([]);
  const [isActive, setIsActive] = useState(demrac ? demrac.is_active : true);
  const [errors, setErrors] = useState({});
  const operators = ['SFR', 'ORANGE', 'FREE', 'Bouygues Telecom'];
  const handleChange = e => {
    const { name, value } = e.target;
    // Special handling for nested fields
    if (name === 'gestionnaire_de_reseau') {
      setFormData({ ...formData, gestionnaire_de_reseau: { nom: value } });
    } else if (name === 'no_devis') {
      setFormData({ ...formData, no_devis: { ND: value } });
    } else if (name === 'Pro_fk') {
      setFormData({ ...formData, Pro_fk: { nom: value } });
    } else if (name === 'SPRid_FK') {
      setFormData({ ...formData, SPRid_FK: { nom: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  useEffect(() => {
    if (demrac) {
      setFormData({
        ...demrac,
        gestionnaire_de_reseau: demrac.gestionnaire_de_reseau || { nom: '' },
        Pro_fk: demrac.Pro_fk || { nom: '' },
        no_devis: demrac.no_devis || { ND: '' },
        SPRid_FK: demrac.SPRid_FK || { SPR_desc: '' },
      });
      setIsActive(demrac.is_active);
    }
  }, [demrac]);
  //   fetch Active propsects
  useEffect(() => {
    const fetchActiveProspects = async Sid => {
      try {
        const result = await SiteDemracService.getActiveProspectsForDemrac(Sid);
        if (result.success) {
          setActivePropescts(result.data);
        } else {
          console.error('Error fetching active prospects:', result.error);
          setActivePropescts([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActivePropescts([]);
      }
    };
    fetchActiveProspects();
  }, []);
  //   fetch Active Entites
  useEffect(() => {
    const fetchActiveEntites = async Sid => {
      try {
        const result = await SiteDemracService.getActiveEntitesForDemrac(Sid);
        if (result.success) {
          setActiveEntites(result.data);
        } else {
          console.error('Error fetching active entites:', result.error);
          setActiveEntites([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveEntites([]);
      }
    };
    fetchActiveEntites();
  }, []);
  //  fetch Active Devis
  useEffect(() => {
    const fetchActiveDevis = async Sid => {
      try {
        const result = await SiteDemracService.getActiveDevisForDemrac(Sid);
        if (result.success) {
          setActiveDevis(result.data);
        } else {
          console.error('Error fetching active devis :', result.error);
          setActiveDevis([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveDevis([]);
      }
    };
    fetchActiveDevis();
  }, []);
  const validateForm = () => {
    const newErrors = {};
    // if (!formData.nom) newErrors.nom = true;
    // if (!formData.latitude) newErrors.latitude = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const demracData = {
        NDRid: formData.NDRid,
        KO_DP: formData.KO_DP,
        date_dr: formData.date_dr,
        drdc: formData.drdc,
        type_rac: formData.type_rac,
        gestionnaire_de_reseau: formData.gestionnaire_de_reseau.nom,
        SPRid_FK: formData.SPRid_FK.SPR_desc,
        no_devis: formData.no_devis.ND,
        Pro_fk: formData.Pro_fk.nom,
        is_active: true,
      };
      console.log('prospect data :', demracData);
      onSave({ Sid, demracData });
      return;
    }
    const demracData = {
      NDRid: formData.NDRid,
      KO_DP: formData.KO_DP,
      date_dr: formData.date_dr,
      drdc: formData.drdc,
      type_rac: formData.type_rac,
      gestionnaire_de_reseau: formData.gestionnaire_de_reseau.nom,
      SPRid_FK: formData.SPRid_FK.SPR_desc,
      no_devis: formData.no_devis.ND,
      Pro_fk: formData.Pro_fk.nom,
      is_active: true,
    };
    onSave({ Sid, demracData });
  };
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  const handleoperatorsChange = e => {
    const { value } = e.target;
    setFormData({ ...formData, operators: value });
  };
  const handleDropdownChange = (field, subField, value) => {
    setFormData({
      ...formData,
      [field]: { [subField]: value },
    });
  };
  const handleCompanieschange = (field, subField, value) => {
    if (field === 'SPRid_FK') {
      // Directly set the numeric ID instead of an object
      setFormData({
        ...formData,
        [field]: { ...formData[field], [subField]: value },
      });
    } else {
      setFormData({
        ...formData,
        [field]: { [subField]: value },
      });
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Ajouter DR
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="NDRid"
            value={formData.NDRid || ''}
            onChange={handleChange}
            placeholder="NDRid*"
            style={{
              marginBottom: '5px',
              width: '320px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <FormControl
            fullWidth
            required
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
          >
            <Select
              labelId="role-select-label"
              name="Pro_fk"
              value={formData.Pro_fk.nom || ''}
              displayEmpty
              onChange={e => handleCompanieschange('Pro_fk', 'nom', e.target.value)}
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un prospect --
              </MenuItem>
              {activeProspects.length > 0 ? (
                activeProspects.map(prospect => (
                  <MenuItem key={prospect.nom} value={prospect.Proid}>
                    {prospect.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active prospects available</MenuItem>
              )}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="KO DP "
              name="KO DP "
              value={formData.KO_DP ? dayjs(formData.KO_DP) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'KO_DP',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="DR Date"
              name="DR Date"
              value={formData.date_dr ? dayjs(formData.date_dr) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'date_dr',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Reception dossier complet"
              name="Reception dossier complet"
              value={formData.drdc ? dayjs(formData.drdc) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'drdc',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="type_rac"
              value={formData.type_rac || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le type de racc --
              </MenuItem>
              <MenuItem value="Simple">Simple</MenuItem>
              <MenuItem value="Complexe">Complexe</MenuItem>
              <MenuItem value="A Renseigner">A Renseigner</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}>
            <InputLabel id="operators-label">operators</InputLabel>
            <Select
              labelId="operators-label"
              name="operators"
              multiple
              value={formData.operators || []}
              onChange={handleoperatorsChange}
              renderValue={selected => selected.join(', ')}
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
            >
              {operators.map(operateur => (
                <MenuItem key={operateur} value={operateur}>
                  <input
                    type="checkbox"
                    checked={formData.operators && formData.operators.includes(operateur)}
                    readOnly
                    style={{ marginRight: '10px' }}
                  />
                  <MDTypography variant="body2">{operateur}</MDTypography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            required
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
          >
            <Select
              labelId="role-select-label"
              name="gestionnaire_de_reseau"
              value={formData.gestionnaire_de_reseau.nom || ''}
              displayEmpty
              onChange={e => handleCompanieschange('gestionnaire_de_reseau', 'nom', e.target.value)}
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un entite --
              </MenuItem>
              {activeEntites.length > 0 ? (
                activeEntites.map(entite => (
                  <MenuItem key={entite.nom} value={entite.Eid}>
                    {entite.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active entites available</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            style={{ marginBottom: '5px', marginTop: '2px', width: '320px' }}
            required
          >
            <Select
              name="SPRid_FK"
              value={formData.SPRid_FK.nom || ''}
              onChange={e => handleDropdownChange('SPRid_FK', 'SPR_desc', e.target.value)}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px', borderColor: errors.prenom ? 'red' : '' }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir un status proposition --
              </MenuItem>
              <MenuItem value="Devis en attente">Devis en attente</MenuItem>
              <MenuItem value="Reçu">Reçu</MenuItem>
            </Select>
          </FormControl>
          <div>
            <label>{isActive ? 'Active' : 'Inactive'}</label>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
            </Switch>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Save
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
DrAddModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  demrac: PropTypes.shape({
    NDRid: PropTypes.string,
    KO_DP: PropTypes.string,
    date_dr: PropTypes.string,
    drdc: PropTypes.string,
    type_rac: PropTypes.string,
    operators: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
      .isRequired,
    gestionnaire_de_reseau: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
    SPRid_FK: PropTypes.shape({
      SPR_desc: PropTypes.string.isRequired,
    }).isRequired,
    no_devis: PropTypes.shape({
      ND: PropTypes.string.isRequired,
    }).isRequired,
    Pro_fk: PropTypes.shape({
      nom: PropTypes.string.isRequired,
    }).isRequired,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DrAddModal;
