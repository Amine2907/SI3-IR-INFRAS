/* eslint-disable */
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
import siteTravService from 'services/site_details/Traveaux/TraveauxService';
const TravUModal = ({ Sid, traveaux, onSave, onClose }) => {
  const [formData, setFormData] = useState(traveaux);
  const [isActive, setIsActive] = useState(traveaux ? traveaux.is_active : true);
  const [activeLib, setActiveLib] = useState([]);
  const [errors, setErrors] = useState({});
  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'paie_id') {
      setFormData({ ...formData, paie_id: { libelle_du_virement: value } });
    } else {
      setFormData(prevData => {
        const updatedData = {
          ...prevData,
          [name]: value,
        };
        return updatedData;
      });
    }
  };
  useEffect(() => {
    if (traveaux) {
      const libNom = activeLib.find(p => p.Pid === traveaux.paie_id)?.libelle_du_virement || '';
      setFormData({
        ...traveaux,
        paie_id: { Pid: traveaux.paie_id || '', libelle_du_virement: libNom },
      });
      setIsActive(traveaux.is_active);
    }
  }, [traveaux, activeLib]);
  useEffect(() => {
    const fecthactiveLib = async () => {
      try {
        const result = await siteTravService.getActiveLibelle(Sid);
        // Ensure result.success is checked, and data is validated.
        if (result.success && Array.isArray(result.data)) {
          setActiveLib(result.data); // Valid array
        } else {
          console.error(
            'Error fetching active libelle de virments:',
            result.error || 'Invalid data structure'
          );
          setActiveLib([]); // Fallback to empty array
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveLib([]); // Fallback to empty array
      }
    };
    fecthactiveLib();
  }, [Sid]);
  const handleDropdownChange = (field, subField, value) => {
    if (field === 'paie_id') {
      const selectedLib = activeLib.find(f => f.Pid === value);
      setFormData({
        ...formData,
        [field]: { Pid: selectedLib?.Pid || '', libelle_du_virement: value },
      });
    } else {
      setFormData({
        ...formData,
        [field]: { ...(formData[field] || {}), [subField]: value },
      });
    }
  };
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
      onSave({
        Sid,
        paie_id: formData.paie_id?.Pid || null,
        ...formData,
        is_active: isActive,
      });
      return;
    }
    onSave({
      ...formData,
      paie_id: formData.paie_id?.Pid || null,
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
          Modifier traveaux
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="Tid"
            label="No Traveaux"
            value={formData.Tid || ''}
            onChange={handleChange}
            placeholder="No virement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <FormControl fullWidth style={{ marginBottom: '10px', width: '300px' }}>
            <InputLabel id="devis-select-label">Libelle virement</InputLabel>
            <Select
              name="paie_id"
              value={formData.paie_id?.libelle_du_virement || ''}
              onChange={e => handleDropdownChange('paie_id', 'libelle_du_virement', e.target.value)}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
            >
              {activeLib.length > 0 ? (
                activeLib.map(lib => (
                  <MenuItem key={lib.id} value={lib.libelle_du_virement}>
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
TravUModal.propTypes = {
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
  onClose: PropTypes.func.isRequired,
};
export default TravUModal;
