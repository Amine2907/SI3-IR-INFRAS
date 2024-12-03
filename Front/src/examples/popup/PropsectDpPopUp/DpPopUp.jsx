import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { Label } from '@radix-ui/react-label';
import { useLocation } from 'react-router-dom';
const DpModal = ({ dp, onSave, onClose }) => {
  const [formData, setFormData] = useState(dp || {});
  const [isActive, setIsActive] = useState(dp ? dp.is_active : true);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { Proid } = location.state || {};
  console.log(Proid);
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // const handleChange = e => {
  //   const { name, value } = e.target;
  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };
  useEffect(() => {
    if (dp) {
      setFormData({
        ...dp,
      });
      setIsActive(dp.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [dp]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const DpData = {
        ANO_certificat_tacite: formData.ANO_certificat_tacite,
        arrete_opposition: formData.arrete_opposition,
        derniere_verification: formData.derniere_verification,
        etat_prerequis: formData.etat_prerequis,
        MJS: formData.MJS,
        numero_DP: formData.numero_DP,
        plans: formData.plans,
        production_DP_PC: formData.production_DP_PC,
        recipisse_depot_DP: formData.recipisse_depot_DP,
        status_go_traveauxP: formData.status_go_traveauxP,
        status_go_traveauxR: formData.status_go_traveauxR,
        is_active: true, // Always true*
      };
      console.log('prospect data :', DpData);
      onSave({ Proid, DpData });
      return;
    }
    const DpData = {
      ANO_certificat_tacite: formData.ANO_certificat_tacite,
      arrete_opposition: formData.arrete_opposition,
      derniere_verification: formData.derniere_verification,
      etat_prerequis: formData.etat_prerequis,
      MJS: formData.MJS,
      numero_DP: formData.numero_DP,
      plans: formData.plans,
      production_DP_PC: formData.production_DP_PC,
      recipisse_depot_DP: formData.recipisse_depot_DP,
      status_go_traveauxP: formData.status_go_traveauxP,
      status_go_traveauxR: formData.status_go_traveauxR,
      is_active: true, // Always true*
    };
    onSave({ Proid, DpData });
  };
  const handleToggleActive = () => {
    if (dp) {
      setIsActive(!isActive);
    }
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <MDInput
            name="etat_prerequis"
            value={formData.etat_prerequis || ''}
            onChange={handleChange}
            placeholder="Etat_prerequis*"
            style={{
              marginBottom: '5px',
              width: '350px',
              marginTop: '10px',
              borderColor: errors.nom ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="numero_DP"
            value={formData.numero_DP || ''}
            onChange={handleChange}
            placeholder="Numero DP"
            style={{
              marginBottom: '5px',
              width: '350px',
              marginTop: '10px',
              borderColor: errors.cout_estime ? 'red' : '',
            }}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="ANO certificat tacite"
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              marginBottom: '10px',
              width: '350px',
            }}
            required
          >
            <Select
              name="plans"
              value={formData.plans || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '5px',
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              style={{ marginBottom: '10px', width: '320px' }}
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
              style={{ marginBottom: '10px', width: '320px' }}
            />
          </LocalizationProvider>
        </div>
        <div>
          <Label>{isActive ? 'Active' : 'Inactive'}</Label>
          <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
            {' '}
            {isActive ? 'Active' : 'Inactive'}
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
DpModal.propTypes = {
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
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default DpModal;
