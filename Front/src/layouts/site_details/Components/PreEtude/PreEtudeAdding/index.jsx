import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import { Select, MenuItem, FormControl } from '@mui/material';
import SiteProspectService from 'services/site_details/Prospect/prospectService';

const PreEtudeAddingModal = ({ Sid, preEtude, onSave }) => {
  const [formData, setFormData] = useState(preEtude || { type_rac: '' });
  const [errors, setErrors] = useState({});
  const [activeProspects, setActiveProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState('');

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
      const updatedData = { ...prevData, [name]: value };

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

      console.log('Updated Data:', updatedData);
      return updatedData;
    });
  };

  const handleProspectChange = event => {
    setSelectedProspect(event.target.value);
  };

  useEffect(() => {
    if (preEtude) {
      setFormData(prevData => ({
        ...prevData,
        ...preEtude,
        ZFA_ZFB: preEtude.ZFA ? 'ZFA' : preEtude.ZFB ? 'ZFB' : '',
      }));
    }
  }, [preEtude]);

  useEffect(() => {
    const fetchActiveProspects = async () => {
      try {
        const result = await SiteProspectService.getActiveProspectsForSite(Sid);
        if (result.success) {
          setActiveProspects(result.data);
        } else {
          console.error('Error fetching active prospects:', result.error);
          setActiveProspects([]);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
        setActiveProspects([]);
      }
    };

    fetchActiveProspects();
  }, [Sid]);
  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.type_rac) newErrors.type_rac = true;
    if (formData.type_rac === 'Complexe' && !formData.ZFA_ZFB) newErrors.ZFA_ZFB = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const preEtudeData = {
      ADPDT: formData.ADPDT,
      CRR: formData.CRR,
      CRP_HTABT: formData.CRP_HTABT,
      MM: formData.MM,
      ZFA: formData.ZFA,
      ZFB: formData.ZFB,
      cout: Number(formData.cout.toFixed(2)),
      type_rac: formData.type_rac,
      CRRBTA: formData.CRRBTA,
    };

    console.log('preEtude data:', preEtudeData);
    onSave({ Sid, preEtudeData });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
            <Select
              name="activeProspect"
              value={selectedProspect}
              onChange={handleProspectChange}
              displayEmpty
              style={{ padding: '10px', fontSize: '14px' }}
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
          <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
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

          {formData.type_rac === 'Complexe' && (
            <>
              <FormControl fullWidth style={{ marginBottom: '10px', width: '320px' }}>
                <Select
                  name="ZFA_ZFB"
                  value={formData.ZFA_ZFB || ''}
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
                style={{ marginBottom: '5px', width: '300px' }}
                required
              />
              <MDInput
                name="CRR"
                value={formData.CRR || ''}
                onChange={handleChange}
                placeholder="Création ou remplacement d'un réseau BT"
                style={{ marginBottom: '5px', width: '300px' }}
                required
              />
              <MDInput
                name="ADPDT"
                value={formData.ADPDT || ''}
                onChange={handleChange}
                placeholder="Augmentation de puissance du transformateur"
                style={{ marginBottom: '5px', width: '300px' }}
                required
              />
              <MDInput
                name="CRRBTA"
                value={formData.CRRBTA || ''}
                onChange={handleChange}
                placeholder="Création réseau BT et augmentation"
                style={{ marginBottom: '5px', width: '300px' }}
                required
              />
              <MDInput
                name="CRP_HTABT"
                value={formData.CRP_HTABT || ''}
                onChange={handleChange}
                placeholder="Création poste HTA/BT"
                style={{ marginBottom: '5px', width: '300px' }}
                required
              />
              {/* <MDInput
                name="cout"
                value={formData.cout.toFixed(2)}
                readOnly
                placeholder="Coût calculé"
                style={{ marginBottom: '5px', width: '300px' }}
              /> */}
            </>
          )}
        </div>
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
    ADPDT: PropTypes.number,
    CRR: PropTypes.number,
    CRP_HTABT: PropTypes.number,
    MM: PropTypes.number,
    ZFA: PropTypes.bool,
    ZFB: PropTypes.bool,
    cout: PropTypes.number,
    type_rac: PropTypes.string,
    CRRBTA: PropTypes.number,
  }),
  onSave: PropTypes.func.isRequired,
};
export default PreEtudeAddingModal;
