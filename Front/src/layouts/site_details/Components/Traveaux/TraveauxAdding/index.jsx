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
const TravAddingModal = ({ Sid, traveaux = {}, onSave }) => {
  const [formData, setFormData] = useState({
    ...traveaux,
  });
  const [errors, setErrors] = useState({});
  const [actvieLibelle, setActiveLib] = useState([]);
  const [isActive, setIsActive] = useState(traveaux.is_active ?? true);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleToggleActive = () => {
    setIsActive(!isActive);
  };
  useEffect(() => {
    const fetchLibelle = async () => {
      try {
        const result = await siteTravService.getActiveLibelle(Sid);
        if (result.success && Array.isArray(result.data)) {
          setActiveLib(result.data);
        } else {
          console.error(
            'Error fetching active libelle de virements:',
            result.error || 'Invalid data structure'
          );
          setActiveLib([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveLib([]);
      }
    };
    fetchLibelle();
  }, [Sid]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Tid) {
      newErrors.Tid = 'No Traveaux est obligatoire';
    }
    if (!formData.paie_id) {
      newErrors.paie_id = 'Libelle du virement est obligatoire';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const traveauxData = {
      Tid: formData.Tid,
      paie_id: formData.paie_id,
      levee_pylone_prev: formData.levee_pylone_prev,
      levee_pylone_reel: formData.levee_pylone_reel,
      extension_prev: formData.extension_prev,
      extension_reel: formData.extension_reel,
      branchement_prev: formData.branchement_prev,
      branchement_reel: formData.branchement_reel,
      fin_gc_prev: formData.fin_gc_prev,
      fin_gc_reel: formData.fin_gc_reel,
      edle_prev: formData.edle_prev,
      edle_reel: formData.edle_reel,
      is_active: isActive,
    };
    console.log('traveaux data :', traveauxData);
    onSave({ Sid, traveauxData });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <MDInput
            name="Tid"
            value={formData.Tid || ''}
            onChange={handleChange}
            placeholder="No traveaux*"
            style={{
              marginBottom: '5px',
              width: '300px',
              borderColor: errors.Tid ? 'red' : '',
            }}
            error={errors.Tid}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <Select
              name="paie_id"
              value={formData.paie_id || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.paie_id ? 'red' : '',
              }}
              error={errors.paie_id}
            >
              <MenuItem value="" disabled>
                -- Choisir libelle Virement* --
              </MenuItem>
              {actvieLibelle.length > 0 ? (
                actvieLibelle.map(lib => (
                  <MenuItem key={lib.Pid} value={lib.libelle_du_virement}>
                    {lib.libelle_du_virement}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No active lib available</MenuItem>
              )}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Levage Pylône (PREV)"
              name="levee_pylone_prev"
              value={formData.levee_pylone_prev ? dayjs(formData.levee_pylone_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'levee_pylone_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Levage Pylône (RÉEL)"
              name="levee_pylone_reel"
              value={formData.levee_pylone_reel ? dayjs(formData.levee_pylone_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'levee_pylone_reel',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Extension (Prev)"
              name="extension_prev"
              value={formData.extension_prev ? dayjs(formData.extension_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'extension_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Extension (Reel)"
              name="extension_reel"
              value={formData.extension_reel ? dayjs(formData.extension_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'extension_reel',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Branchement (PREV)"
              name="branchement_prev"
              value={formData.branchement_prev ? dayjs(formData.branchement_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'branchement_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Branchement (REEL)"
              name="branchement_reel"
              value={formData.branchement_reel ? dayjs(formData.branchement_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'branchement_reel',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Fin GC (Prev)"
              name="fin_gc_prev"
              value={formData.fin_gc_prev ? dayjs(formData.fin_gc_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'fin_gc_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Fin GC (REEL)"
              name="fin_gc_reel"
              value={formData.fin_gc_reel ? dayjs(formData.fin_gc_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'fin_gc_reel',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="EDLE (Prev)"
              name="edle_prev"
              value={formData.edle_prev ? dayjs(formData.edle_prev) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'edle_prev',
                    value: newValue ? newValue.format('YYYY-MM-DD') : '',
                  },
                });
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="EDLE (REEL)"
              name="edle_reel"
              value={formData.edle_reel ? dayjs(formData.edle_reel) : null}
              onChange={newValue => {
                handleChange({
                  target: {
                    name: 'edle_reel',
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
TravAddingModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  traveaux: PropTypes.shape({
    Tid: PropTypes.string,
    paie_id: PropTypes.string,
    levee_pylone_prev: PropTypes.string,
    levee_pylone_reel: PropTypes.string,
    extension_prev: PropTypes.string,
    extension_reel: PropTypes.string,
    branchement_prev: PropTypes.string,
    branchement_reel: PropTypes.string,
    fin_gc_prev: PropTypes.string,
    fin_gc_reel: PropTypes.string,
    edle_prev: PropTypes.string,
    edle_reel: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};
export default TravAddingModal;
