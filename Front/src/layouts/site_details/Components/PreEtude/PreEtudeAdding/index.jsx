/* eslint-disable */
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
const PreEtudeAddingModal = ({ Sid, preEtude, onSave, onClose }) => {
  const [formData, setFormData] = useState(preEtude || {});
  const [isActive, setIsActive] = useState(preEtude ? preEtude.is_active : false);
  const [selectedpreEtude, setSelectedpreEtude] = useState(null);
  const [errors, setErrors] = useState({});
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (preEtude) {
      setFormData(prevData => ({
        ...prevData,
        ...preEtude,
      }));
      setIsActive(preEtude.is_active);
    }
    console.log('Initialized formData:', formData);
  }, [preEtude]);
  const validateForm = () => {
    const newErrors = {};
    if (!formData.ZFA) newErrors.ZFA = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const preEtudeData = {
        ApreEtudeDT: formData.ApreEtudeDT,
        CRR: formData.CRR,
        CRP_HTABT: formData.CRP_HTABT,
        MM: formData.MM,
        MJS: formData.MJS,
        ZFA: formData.ZFA,
        ZFB: formData.ZFB,
        cout: formData.cout,
        type_rac: formData.type_rac,
        CRRBTA: formData.CRRBTA,
        is_active: true,
      };
      console.log('prospect data :', preEtudeData);
      onSave({ Sid, preEtudeData });
      return;
    }
    const preEtudeData = {
      ApreEtudeDT: formData.ApreEtudeDT,
      CRR: formData.CRR,
      CRP_HTABT: formData.CRP_HTABT,
      MM: formData.MM,
      MJS: formData.MJS,
      ZFA: formData.ZFA,
      ZFB: formData.ZFB,
      cout: formData.cout,
      type_rac: formData.type_rac,
      CRRBTA: formData.CRRBTA,
      is_active: true, // Always true
    };
    onSave({ Sid, preEtudeData });
  };
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="MM"
              value={formData.MM || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.MM ? 'red' : '',
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
          <MDInput
            name="ZFA"
            value={formData.ZFA || ''}
            onChange={handleChange}
            placeholder="Numero preEtude"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.ZFA ? 'red' : '',
            }}
            required
          />
          {errors.ZFA && <span style={{ color: 'red', fontSize: '12px' }}>{errors.ZFA}</span>}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="ANO certificat tacite"
              name="ApreEtudeDT"
              value={formData.ApreEtudeDT ? dayjs(formData.ApreEtudeDT) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'ApreEtudeDT',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Arrete opposition"
              name="CRR"
              value={formData.CRR ? dayjs(formData.CRR) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'CRR',
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
              name="CRP_HTABT"
              value={formData.CRP_HTABT ? dayjs(formData.CRP_HTABT) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'CRP_HTABT',
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
              name="ZFB"
              value={formData.ZFB || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.ZFB ? 'red' : '',
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
              label="Production preEtude PC"
              name="cout"
              value={formData.cout ? dayjs(formData.cout) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'cout',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Recipisse depot preEtude"
              name="type_rac"
              value={formData.type_rac ? dayjs(formData.type_rac) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'type_rac',
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
              name="CRP_HTABT"
              value={formData.CRP_HTABT ? dayjs(formData.CRP_HTABT) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'CRP_HTABT',
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
              name="CRRBTA"
              value={formData.CRRBTA ? dayjs(formData.CRRBTA) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'CRRBTA',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '270px' }}
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
PreEtudeAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  preEtude: PropTypes.shape({
    ApreEtudeDT: PropTypes.string,
    CRR: PropTypes.string,
    CRP_HTABT: PropTypes.string,
    MM: PropTypes.string,
    MJS: PropTypes.string,
    ZFA: PropTypes.string,
    ZFB: PropTypes.string,
    cout: PropTypes.string,
    type_rac: PropTypes.string,
    CRRBTA: PropTypes.string,
    is_active: PropTypes.bool,
    relance: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PreEtudeAddingModal;
