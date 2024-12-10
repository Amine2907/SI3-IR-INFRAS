/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { Label } from '@radix-ui/react-label';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
const PreEtModal = ({ Sid, preEtude, onSave, onClose }) => {
  const [formData, setFormData] = useState(preEtude || {});
  const [isActive, setIsActive] = useState(preEtude ? preEtude.is_active : true);
  const [activeProspects, setActiveProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'type_rac') {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleProspectChange = event => {
    const { value } = event.target;
    setSelectedProspect(value);
  };
  useEffect(() => {
    if (preEtude) {
      setFormData({
        ...preEtude,
      });
      setSelectedProspect(preEtude.prospectName || '');
      setIsActive(preEtude.is_active);
    }
  }, [preEtude]);
  const fetchActiveProspects = async () => {
    try {
      // Call the service method to fetch active prospects for the given Sid
      const result = await SiteProspectService.getActiveProspectsForSite(Sid);
      // Check if the result is successful
      if (result.success) {
        // Set the active prospects data if the response is successful
        setActiveProspects(result.data);
      } else {
        console.error('Error fetching active prospects:', result.error);
        setActiveProspects([]);
      }
    } catch (error) {
      // Handle errors during the fetch
      console.error('Error during fetch:', error.message);
      setActiveProspects([]); // Set an empty array in case of error
    }
  };
  useEffect(() => {
    fetchActiveProspects();
  }, [Sid, preEtude]);
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
    });
    onSave({ ...formData, is_active: isActive });
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
          Modifier PreEtude
        </MDTypography>
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
              name="activeProspect"
              value={activeProspects.find(p => p.nom === selectedProspect) ? selectedProspect : ''}
              onChange={handleProspectChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
              }}
            >
              <MenuItem value="" disabled>
                -- Choisir le prospect --
              </MenuItem>
              {activeProspects.map(prospect => (
                <MenuItem key={prospect.id} value={prospect.nom}>
                  {prospect.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '320px',
            }}
            required
          >
            <Select
              name="type_rac"
              value={formData.type_rac || ''}
              onChange={handleChange}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.type_rac ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Type de raccordement --
              </MenuItem>
              <MenuItem value="Simple">Simple</MenuItem>
              <MenuItem value="Complexe">Complexe</MenuItem>
            </Select>
          </FormControl> */}
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
              name="ZFA_ZFB"
              value={formData.ZFA === 1 ? 'ZFA' : formData.ZFB === 2 ? 'ZFB' : ''}
              onChange={e => {
                const value = e.target.value;
                setFormData(prevData => ({
                  ...prevData,
                  ZFA: value === 'ZFA' ? 1 : null, // Update ZFA if selected
                  ZFB: value === 'ZFB' ? 2 : null, // Update ZFB if selected
                }));
              }}
              displayEmpty
              style={{
                padding: '10px',
                fontSize: '14px',
                borderColor: errors.ZFA_ZFB ? 'red' : '',
              }}
              required
            >
              <MenuItem value="" disabled>
                -- Choisir ZFA/ZFB --
              </MenuItem>
              <MenuItem value="ZFA">ZFA</MenuItem>
              <MenuItem value="ZFB">ZFB</MenuItem>
            </Select>
          </FormControl>
          <MDInput
            name="MM"
            value={formData.MM || ''}
            onChange={handleChange}
            placeholder="Moyenne metres"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.MM ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="CRR"
            value={formData.CRR || ''}
            onChange={handleChange}
            placeholder="Création ou remplacement d'un réseau BT"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRR ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="ADPDT"
            value={formData.ADPDT || ''}
            onChange={handleChange}
            placeholder="Augmentation de puissance du transformateur"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.ADPDT ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="CRRBTA"
            value={formData.CRRBTA || ''}
            onChange={handleChange}
            placeholder="Création réseau BT et augmentation"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRRBTA ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="CRP_HTABT"
            value={formData.CRP_HTABT || ''}
            onChange={handleChange}
            placeholder="Création poste HTA/BT"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.CRP_HTABT ? 'red' : '',
            }}
            required
          />
          <MDInput
            name="cout"
            value={formData.cout || ''}
            onChange={handleChange}
            placeholder="Cout"
            style={{
              marginBottom: '5px',
              width: '300px',
              marginTop: '10px',
              borderColor: errors.cout ? 'red' : '',
            }}
            disabled
          />
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
PreEtModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  preEtude: PropTypes.shape({
    ADPDT: PropTypes.string,
    CRR: PropTypes.string,
    CRP_HTABT: PropTypes.string,
    MM: PropTypes.string,
    ZFA: PropTypes.string,
    ZFB: PropTypes.string,
    cout: PropTypes.string,
    type_rac: PropTypes.string,
    CRRBTA: PropTypes.string,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PreEtModal;
