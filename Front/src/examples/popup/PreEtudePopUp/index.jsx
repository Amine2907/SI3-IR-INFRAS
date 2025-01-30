/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from '../largeStyles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, Icon, InputLabel } from '@mui/material';
import { Label } from '@radix-ui/react-label';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
const PreEtModal = ({ Sid, preEtude, onSave, onClose }) => {
  const [formData, setFormData] = useState(preEtude || {});
  const [isActive, setIsActive] = useState(preEtude ? preEtude.is_active : true);
  const [activeProspects, setActiveProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState('');
  const [errors, setErrors] = useState({});
  const calculateCout = (ZFA, ZFB, MM, CRR, ADAPT, CRRBTA, CRP_HTABT) => {
    let baseValue = 2210 + MM * 99 + ADAPT * 2708 + CRRBTA * 7668;
    if (ZFA) {
      return 0.6 * (baseValue + CRR * 2407 + CRP_HTABT * 15180);
    }
    if (ZFB) {
      return 0.6 * (baseValue + CRR * 3113 + CRP_HTABT * 25579);
    }
    return 0;
  };
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      if (name === 'ZFA_ZFB') {
        updatedData.ZFA = value === 'ZFA';
        updatedData.ZFB = value === 'ZFB';
      }
      ['MM', 'CRR', 'ADPDT', 'CRRBTA', 'CRP_HTABT'].forEach(field => {
        updatedData[field] = Number(updatedData[field]) || 0;
      });
      updatedData.cout = calculateCout(
        updatedData.ZFA,
        updatedData.ZFB,
        updatedData.MM,
        updatedData.CRR,
        updatedData.ADPDT,
        updatedData.CRRBTA,
        updatedData.CRP_HTABT
      );
      return updatedData;
    });
  };
  const handleProspectChange = event => {
    const { value } = event.target;
    setSelectedProspect(value);
  };
  useEffect(() => {
    if (preEtude) {
      setFormData({
        ...preEtude,
        ZFA_ZFB: preEtude.ZFA ? 'ZFA' : preEtude.ZFB ? 'ZFB' : '',
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
    if (formData.type_rac === 'Complexe' && !formData.ZFA_ZFB) newErrors.ZFA_ZFB = true;
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
      ZFA: formData.ZFA_ZFB === 'ZFA',
      ZFB: formData.ZFA_ZFB === 'ZFB',
      cout: Number(formData.cout.toFixed(2)),
    });
    delete formData.ZFA_ZFB;
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
              width: '300px',
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
          <FormControl
            fullWidth
            style={{
              marginTop: '12px',
              marginBottom: '2px',
              width: '300px',
            }}
            required
          >
            <Select
              name="ZFA_ZFB"
              value={formData.ZFA_ZFB || '-- Choisir ZFA/ZFB --'}
              onChange={handleChange}
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
          <div style={{ position: 'relative', width: '300px' }}>
            <MDInput
              name="cout"
              value={formData.cout ? `${formData.cout.toFixed(2)}` : ''}
              onChange={handleChange}
              placeholder="Cout"
              style={{
                marginBottom: '5px',
                width: '100%',
                marginTop: '10px',
                borderColor: errors.cout ? 'red' : '',
              }}
              disabled
            />
            <Icon
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              euro
            </Icon>
          </div>
        </div>
        <div>
          <InputLabel>{isActive ? 'Active' : 'Inactive'}</InputLabel>
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
    ADPDT: PropTypes.number,
    CRR: PropTypes.number,
    CRP_HTABT: PropTypes.number,
    MM: PropTypes.number,
    ZFA: PropTypes.bool,
    ZFB: PropTypes.bool,
    cout: PropTypes.number,
    type_rac: PropTypes.string,
    CRRBTA: PropTypes.number,
    is_active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PreEtModal;
