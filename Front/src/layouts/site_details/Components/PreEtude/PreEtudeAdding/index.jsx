/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Switch, Select, MenuItem, FormControl } from '@mui/material';
import { Label } from '@radix-ui/react-label';
import SiteProspectService from 'services/site_details/Prospect/prospectService';
const PreEtudeAddingModal = ({ Sid, preEtude, onSave }) => {
  const [formData, setFormData] = useState(preEtude || { type_rac: '' });
  const [errors, setErrors] = useState({});
  const [activeProspects, setActiveProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState('');
  const calculateCout = (ZFA, ZFB, MM, CRR, ADAPT, CRRBTA, CRP_HTABT) => {
    let ZFAValue = 0;
    let ZFBValue = 0;
    if (ZFA) {
      ZFAValue = 2210 + MM * 99 + CRR * 2407 + ADAPT * 2708 + CRRBTA * 7668 + CRP_HTABT * 15180;
    }
    if (ZFB) {
      ZFBValue = 2210 + MM * 99 + CRR * 3113 + ADAPT * 2708 + CRRBTA * 7668 + CRP_HTABT * 25579;
    }
    // Return the correct value based on ZFA or ZFB
    if (ZFA) return 0.6 * ZFAValue;
    if (ZFB) return 0.6 * ZFBValue;
    return 0;
  };
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prevData => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      // Handle ZFA/ZFB specific calculations for "Complexe" only
      if (name === 'ZFA' || name === 'ZFB') {
        // Set ZFA or ZFB as boolean based on the selected value
        if (name === 'ZFA') {
          updatedData.ZFA = value === 'true'; // Set ZFA to true when selected, otherwise false
          updatedData.ZFB = false; // Reset ZFB when ZFA is selected
        } else if (name === 'ZFB') {
          updatedData.ZFB = value === 'true'; // Set ZFB to true when selected, otherwise false
          updatedData.ZFA = false; // Reset ZFA when ZFB is selected
        }
      }
      // Ensure fields are numeric before using them in calculation
      updatedData.MM = Number(updatedData.MM);
      updatedData.CRR = Number(updatedData.CRR);
      updatedData.ADPDT = Number(updatedData.ADPDT);
      updatedData.CRRBTA = Number(updatedData.CRRBTA);
      updatedData.CRP_HTABT = Number(updatedData.CRP_HTABT);
      // Calculate cout based on the selected ZFA or ZFB
      updatedData.cout = calculateCout(
        updatedData.ZFA,
        updatedData.ZFB,
        updatedData.MM,
        updatedData.CRR,
        updatedData.ADPDT,
        updatedData.CRRBTA,
        updatedData.CRP_HTABT
      );
      console.log('Updated Data:', updatedData); // Log the updated data for debugging

      return updatedData;
    });
  };
  useEffect(() => {
    console.log('Cout value updated:', formData.cout); // This will log whenever formData.cout changes
  }, [formData.cout]);
  const handleProspectChange = event => {
    const { value } = event.target;
    setSelectedProspect(value);
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
  // Fetch active prospects
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
    // if (!formData.ZFA && !formData.ZFB) newErrors.ZFA_ZFB = true;
    return newErrors;
  };
  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const preEtudeData = {
      ADPDT: formData.ADPDT,
      CRR: formData.CRR,
      CRP_HTABT: formData.CRP_HTABT,
      MM: formData.MM,
      ZFA: formData.ZFA, // Now ZFA is numeric (1 or null)
      ZFB: formData.ZFB, // Now ZFB is numeric (1 or null)
      cout: formData.cout, // Send the calculated cout value to the backend
      type_rac: formData.type_rac,
      CRRBTA: formData.CRRBTA,
    };
    console.log('preEtude data :', preEtudeData);
    onSave({ Sid, preEtudeData });
  };
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          {/* Dropdown for Moyenne Metres */}
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
          {/* Dropdown for Type de Raccordement */}
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
              name="type_rac"
              value={formData.type_rac}
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
                -- Choisir le type de raccordement --
              </MenuItem>
              <MenuItem value="Simple">Simple</MenuItem>
              <MenuItem value="Complexe">Complexe</MenuItem>
            </Select>
          </FormControl>
          {/* Conditionally render fields if type_rac is "Complexe" */}
          {formData.type_rac === 'Complexe' && (
            <>
              {/* Dropdown for ZFA/ZFB */}
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
                  value={formData.ZFA ? 'true' : formData.ZFB ? 'false' : ''}
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
                  <MenuItem value="true">ZFA</MenuItem>
                  <MenuItem value="false">ZFB</MenuItem>
                </Select>
              </FormControl>
              {/* Additional Fields */}
              <MDInput
                name="MM"
                value={formData.MM || ''}
                onChange={handleChange}
                placeholder="Moyenne metres"
                style={{
                  marginBottom: '5px',
                  width: '300px',
                  marginTop: '10px',
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
                }}
                required
              />
            </>
          )}
        </div>
        {/* Buttons */}
        <div className={styles.buttonContainer}>
          <MDButton onClick={handleSubmit} variant="gradient" color="dark">
            Creer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
PreEtudeAddingModal.propTypes = {
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
export default PreEtudeAddingModal;
