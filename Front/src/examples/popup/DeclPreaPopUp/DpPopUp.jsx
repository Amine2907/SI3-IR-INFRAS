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
import { mapEtatValues } from './DpData';
const DpUModal = ({ dp, onSave, onClose }) => {
  const [formData, setFormData] = useState(dp || {});
  const [isActive, setIsActive] = useState(dp ? dp.is_active : true);
  const [isRelance, setIsRelance] = useState(dp ? dp.relance : true);
  const [errors, setErrors] = useState({});
  const handleToggleRelance = () => {
    console.log('Toggling Retenu:', !isRelance);
    setIsRelance(!isRelance);
  };
  const handleChange = event => {
    const { name, value } = event.target;
    console.log('Form input change:', name, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (dp) {
      setFormData(prevData => ({
        ...prevData,
        ...dp,
        etat_prerequis: mapEtatValues(dp.etat_prerequis),
      }));
      setIsActive(dp.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [dp]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.numero_DP) {
      newErrors.numero_DP = 'Numero DP est obligatoire !';
    }
    if (!formData.ANO_certificat_tacite) {
      newErrors.ANO_certificat_tacite = 'ANO certificat tacite est obligatoire !';
    }
    return newErrors;
  };
  const handleSubmit = () => {
    console.log('handleSubmit called');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Trigger the onSave callback
    onSave({ ...formData, is_active: isActive, relance: isRelance });
  };
  const handleToggleActive = () => {
    if (dp) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier DP
        </MDTypography>
        <div className={styles.formGrid}>
          <FormControl
            fullWidth
            style={{ marginTop: '12px', marginBottom: '2px', width: '320px' }}
            required
          >
            <InputLabel>État Prérequis</InputLabel>
            <Select
              name="etat_prerequis"
              value={formData.etat_prerequis || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.etat_prerequis ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir l&apos;état prérequis --
              </MenuItem>
              <MenuItem value="Complet">Complet</MenuItem>
              <MenuItem value="Incomplet">Incomplet</MenuItem>
            </Select>
          </FormControl>
          <MDInput
            name="numero_DP"
            label="Numéro DP*"
            value={formData.numero_DP || ''}
            onChange={handleChange}
            placeholder="Numéro DP"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.numero_DP ? 'red' : '',
            }}
            disabled
            error={errors.numero_DP}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="ANO certificat tacite*"
              name="ANO_certificat_tacite"
              value={formData.ANO_certificat_tacite ? dayjs(formData.ANO_certificat_tacite) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'ANO_certificat_tacite',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
              error={errors.ANO_certificat_tacite}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Arrete opposition"
              name="arrete_opposition"
              value={formData.arrete_opposition ? dayjs(formData.arrete_opposition) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'arrete_opposition',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Derniere verification"
              name="derniere_verification"
              value={formData.derniere_verification ? dayjs(formData.derniere_verification) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'derniere_verification',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MJS"
              name="MJS"
              value={formData.MJS ? dayjs(formData.MJS) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'MJS',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '300px' }}
            />
          </LocalizationProvider>
          <FormControl
            fullWidth
            style={{
              marginTop: '2px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="plans"
              value={formData.plans || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.plans ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir le status du plan --
              </MenuItem>
              <MenuItem value="OK">OK</MenuItem>
              <MenuItem value="NOK">NOK</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Production DP PC"
              name="production_DP_PC"
              value={formData.production_DP_PC ? dayjs(formData.production_DP_PC) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'production_DP_PC',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Recipisse depot DP"
              name="recipisse_depot_DP"
              value={formData.recipisse_depot_DP ? dayjs(formData.recipisse_depot_DP) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'recipisse_depot_DP',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Status go traveaux (P)"
              name="status_go_traveauxP"
              value={formData.status_go_traveauxP ? dayjs(formData.status_go_traveauxP) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'status_go_traveauxP',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Status go traveaux (R)"
              name="status_go_traveauxR"
              value={formData.status_go_traveauxR ? dayjs(formData.status_go_traveauxR) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'status_go_traveauxR',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
        </div>
        <div>
          <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
          <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
            {' '}
            {isActive ? 'Active' : 'Inactive'}
          </Switch>
          <InputLabel>{isRelance ? 'Relance' : 'Non Relance'}</InputLabel>
          <Switch type="checkbox" checked={isRelance} onChange={handleToggleRelance}>
            {isRelance ? 'Relance' : 'Non Relance'}
          </Switch>
        </div>
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            enregistrer
          </MDButton>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
DpUModal.propTypes = {
  dp: PropTypes.shape({
    ANO_certificat_tacite: PropTypes.string,
    arrete_opposition: PropTypes.string,
    derniere_verification: PropTypes.string,
    etat_prerequis: PropTypes.string,
    MJS: PropTypes.string,
    numero_DP: PropTypes.string,
    plans: PropTypes.string,
    production_DP_PC: PropTypes.string,
    recipisse_depot_DP: PropTypes.string,
    status_go_traveauxP: PropTypes.string,
    status_go_traveauxR: PropTypes.string,
    is_active: PropTypes.bool,
    relance: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DpUModal;
