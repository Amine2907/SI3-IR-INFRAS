import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, Grid, FormHelperText } from '@mui/material';
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
    // if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    console.log('handleSubmit called');
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log('Validation errors:', newErrors);
      return;
    }
    console.log('Submitting form data:', {
      ...formData,
      is_active: isActive,
      relance: isRelance,
    });
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Etat Prerequis</MDTypography>
            <FormControl
              fullWidth
              style={{
                marginTop: '4px',
                marginBottom: '2px',
              }}
              required
            >
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
                  -- Choisir l&apos;etat prerequis --
                </MenuItem>
                <MenuItem value="Complet">Complet</MenuItem>
                <MenuItem value="Incomplet">Incomplet</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Numero DP</MDTypography>
            <MDInput
              name="numero_DP"
              value={formData.numero_DP || ''}
              onChange={handleChange}
              placeholder="Numero DP"
              style={{
                marginTop: '4px',
                width: '100%',
                borderColor: errors.numero_DP ? 'red' : '',
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">ANO Certificat Tacite</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                name="ANO_certificat_tacite"
                value={
                  formData.ANO_certificat_tacite ? dayjs(formData.ANO_certificat_tacite) : null
                }
                onChange={newValue => {
                  handleChange({
                    target: {
                      name: 'ANO_certificat_tacite',
                      value: newValue ? newValue.format('YYYY-MM-DD') : '',
                    },
                  });
                }}
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Arrete Opposition</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Derniere Verification</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                name="derniere_verification"
                value={
                  formData.derniere_verification ? dayjs(formData.derniere_verification) : null
                }
                onChange={newValue => {
                  handleChange({
                    target: {
                      name: 'derniere_verification',
                      value: newValue ? newValue.format('YYYY-MM-DD') : '',
                    },
                  });
                }}
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">MJS</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Plans</MDTypography>
            <FormControl
              fullWidth
              style={{
                marginTop: '4px',
                marginBottom: '2px',
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Production DP PC</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Recipisse Depot DP</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Status Go Traveaux (P)</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Status Go Traveaux (R)</MDTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
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
                style={{ marginTop: '4px', width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Status</MDTypography>
            <FormControl component="fieldset">
              <Switch
                checked={isActive}
                onChange={handleToggleActive}
                name="is_active"
                inputProps={{ 'aria-label': 'active status' }}
              />
              <FormHelperText>{isActive ? 'Active' : 'Inactive'}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MDTypography variant="subtitle2">Relance</MDTypography>
            <FormControl component="fieldset">
              <Switch
                checked={isRelance}
                onChange={handleToggleRelance}
                name="relance"
                inputProps={{ 'aria-label': 'relance status' }}
              />
              <FormHelperText>{isRelance ? 'Relance' : 'Non Relance'}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
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
