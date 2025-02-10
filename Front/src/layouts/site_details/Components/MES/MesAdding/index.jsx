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
import siteTravService from 'services/site_details/Traveaux/TraveauxService';

const MesAddingModal = ({ Sid, mes = {}, onSave }) => {
  const [formData, setFormData] = useState({
    ...(mes || {}),
  });
  const [errors, setErrors] = useState({});
  const [activeTrav, setActiveTrav] = useState([]);
  const [isActive, setIsActive] = useState(mes?.is_active ?? true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const fetchActiveTrav = async () => {
      try {
        const result = await siteTravService.getActiveTrav(Sid);
        if (result.success && Array.isArray(result.data)) {
          setActiveTrav(result.data);
        } else {
          console.error(
            'Error fetching active traveaux:',
            result.error || 'Invalid data structure'
          );
          setActiveTrav([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveTrav([]);
      }
    };
    fetchActiveTrav();
  }, [Sid]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.no_PDL) {
      newErrors.no_PDL = 'Numero Mes est obligatoire';
    }
    if (!formData.traveaux_id) {
      newErrors.traveaux_id = 'Numero traveaux est obligatoire';
    }
    if (!formData.status_consuel) {
      newErrors.status_consuel = 'Status Consuel est obligatoire';
    }
    setErrors(newErrors);
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const mesData = {
      no_PDL: formData.no_PDL,
      traveaux_id: formData.traveaux_id,
      status_consuel: formData.status_consuel,
      consuel_remise: formData.consuel_remise,
      MES_demande: formData.MES_demande,
      MES_prev: formData.MES_prev,
      MES_reel: formData.MES_reel,
      is_active: isActive,
    };
    console.log('mes data :', mesData);
    onSave({ Sid, mesData });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <MDInput
            name="no_PDL"
            value={formData.no_PDL || ''}
            onChange={handleChange}
            placeholder="No mes*"
            style={{
              marginBottom: '5px',
              width: '300px',
              borderColor: errors.no_PDL ? 'red' : '',
            }}
            error={errors.no_PDL}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="traveaux_id"
              value={formData.traveaux_id || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.traveaux_id ? 'red' : '',
              }}
              error={errors.traveaux_id}
            >
              <MenuItem value="" disabled>
                -- Choisir Traveaux* --
              </MenuItem>
              {activeTrav.length > 0 ? (
                activeTrav.map(trav => (
                  <MenuItem key={trav.Tid} value={trav.Tid}>
                    {trav.Tid}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Pas des traveaux actives</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="status_consuel"
              value={formData.status_consuel || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.status_consuel ? 'red' : '',
              }}
              error={errors.status_consuel}
            >
              <MenuItem value="" disabled>
                -- Choisir Status consuel* --
              </MenuItem>
              <MenuItem value="En attente">En attente</MenuItem>
              <MenuItem value="ok">ok</MenuItem>
            </Select>
          </FormControl>
          {/* Date pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Consuel remise"
              name="consuel_remise"
              value={formData.consuel_remise ? dayjs(formData.consuel_remise) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'consuel_remise',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Demande MES"
              name="MES_demande"
              value={formData.MES_demande ? dayjs(formData.MES_demande) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'MES_demande',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MES (PREV)"
              name="MES_prev"
              value={formData.MES_prev ? dayjs(formData.MES_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'MES_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MES (REEL)"
              name="MES_reel"
              value={formData.MES_reel ? dayjs(formData.MES_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'MES_reel',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
            />
          </LocalizationProvider>
        </div>
        <div className={styles.switchContainer}>
          <div className={styles.switchItem}>
            <InputLabel>Active</InputLabel>
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
MesAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  mes: PropTypes.shape({
    no_PDL: PropTypes.string,
    traveaux_id: PropTypes.string,
    status_consuel: PropTypes.string,
    consuel_remise: PropTypes.string,
    MES_demande: PropTypes.string,
    MES_prev: PropTypes.string,
    MES_reel: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};

MesAddingModal.defaultProps = {
  mes: {},
};
export default MesAddingModal;
