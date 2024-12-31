/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import siteTravService from 'services/site_details/Traveaux/TraveauxService';
const MesUModal = ({ Sid, mes, onSave, onClose }) => {
  const [formData, setFormData] = useState(mes);
  const [isActive, setIsActive] = useState(mes ? mes.is_active : true);
  const [activeTrav, setActiveTrav] = useState([]);
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
    if (mes) {
      setFormData({
        ...mes,
      });
      setIsActive(mes.is_active);
    }
  }, [mes]);
  useEffect(() => {
    const fetchActiveTrav = async () => {
      try {
        const result = await siteTravService.getActiveTrav(Sid);
        // Ensure result.success is checked, and data is validated.
        if (result.success && Array.isArray(result.data)) {
          setActiveTrav(result.data); // Valid array
        } else {
          console.error(
            'Error fetching active traveaux de site:',
            result.error || 'Invalid data structure'
          );
          setActiveTrav([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveTrav([]); // Fallback to empty array
      }
    };
    fetchActiveTrav();
  }, [Sid]);
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
      console.log('demRac data :', mesData);
      onSave({
        Sid,
        ...formData,
        is_active: isActive,
      });
      return;
    }
    onSave({
      ...formData,
      is_active: isActive,
    });
  };
  const handleToggleActive = () => {
    setIsActive(prevState => !prevState);
    setFormData(prevData => ({
      ...prevData,
      is_active: !isActive,
    }));
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Modifier MES
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="no_PDL"
            value={formData.no_PDL || ''}
            onChange={handleChange}
            placeholder="No PDL"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="traveaux_id"
              value={formData.traveaux_id || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir traveaux --
              </MenuItem>
              {activeTrav.length > 0 ? (
                activeTrav.map(trav => (
                  <MenuItem key={trav.id} value={trav.travelle_du_virement}>
                    {trav.travelle_du_virement}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active traveaux available</MenuItem>
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="status_consuel"
              value={formData.status_consuel || ''}
              onChange={handleChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              <MenuItem value="" disabled>
                -- Choisir Status consuel --
              </MenuItem>
              <MenuItem value="En attente">En attente</MenuItem>
              <MenuItem value="ok">ok</MenuItem>
            </Select>
          </FormControl>
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
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MES Demande"
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
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MES (Prev)"
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
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="MES (Reel)"
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
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <div>
            <InputLabel>Active</InputLabel>
            <Switch type="checkbox" checked={isActive} onChange={handleToggleActive}>
              {' '}
              {isActive ? 'Active' : 'Inactive'}
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
MesUModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  mes: PropTypes.shape({
    no_PDL: PropTypes.string,
    traveaux_id: PropTypes.string,
    consuel_remise: PropTypes.string,
    MES_demande: PropTypes.string,
    MES_prev: PropTypes.string,
    MES_reel: PropTypes.string,
    status_consuel: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default MesUModal;
