/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import PropTypes from 'prop-types';
import MDButton from 'components/MDButton';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import { Switch, Select, MenuItem, FormControl, Icon, InputLabel } from '@mui/material';
import SiteDevisService from 'services/site_details/Devis/DevisService';
const DevisRemModal = ({ Sid, devis }) => {
  const [formData, setFormData] = useState(devis);
  const [factureForDevis, setFactureForDevis] = useState([]);
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
    if (devis) {
      setFormData({
        ...devis,
      });
    }
  }, [devis]);
  //   fetching active fournisseurs for the site
  const fetchFactureForDevis = async () => {
    try {
      // Call the service method to fetch active prospects for the given Sid
      const result = await SiteDevisService.getActiveFrnsForDevis(Sid);
      // Check if the result is successful
      if (result.success) {
        // Set the active prospects data if the response is successful
        setFactureForDevis(result.data);
      } else {
        console.error('Error fetching active fournisseurs :', result.error);
        setFactureForDevis([]);
      }
    } catch (error) {
      // Handle errors during the fetch
      console.error('Error during fetch:', error.message);
      setFactureForDevis([]); // Set an empty array in case of error
    }
  };
  useEffect(() => {
    fetchFactureForDevis();
  }, [Sid, devis]);
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          Remboursement
        </MDTypography>
        <div className={styles.formGrid}>
          <MDInput
            name="code_postal_lieu"
            value={formData.code_postal_lieu || ''}
            onChange={handleChange}
            placeholder="CP du lieu de Raccordement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="code_postal_lieu"
            value={formData.code_postal_lieu || ''}
            onChange={handleChange}
            placeholder="CP du lieu de Raccordement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <div style={{ position: 'relative', width: '300px' }}>
            <MDInput
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="Montant (TTC) "
              style={{
                marginBottom: '5px',
                width: '100%',
                marginTop: '10px',
                borderColor: errors.montant ? 'red' : '',
              }}
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
          <MDInput
            name="code_postal_lieu"
            value={formData.code_postal_lieu || ''}
            onChange={handleChange}
            placeholder="CP du lieu de Raccordement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <MDInput
            name="code_postal_lieu"
            value={formData.code_postal_lieu || ''}
            onChange={handleChange}
            placeholder="CP du lieu de Raccordement"
            style={{ marginBottom: '5px', width: '300px' }}
            required
          />
          <div style={{ position: 'relative', width: '300px' }}>
            <MDInput
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="Montant (TTC) "
              style={{
                marginBottom: '5px',
                width: '100%',
                marginTop: '10px',
                borderColor: errors.montant ? 'red' : '',
              }}
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
          <div style={{ position: 'relative', width: '300px' }}>
            <MDInput
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              placeholder="Montant (TTC) "
              style={{
                marginBottom: '5px',
                width: '100%',
                marginTop: '10px',
                borderColor: errors.montant ? 'red' : '',
              }}
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
      </div>
    </div>
  );
};
DevisRemModal.propTypes = {
  Sid: PropTypes.string.isRequired,
  devis: PropTypes.shape({
    ND: PropTypes.number,
    fournisseur: PropTypes.string,
    no_dr: PropTypes.string,
    type_devis: PropTypes.string,
    devis_date: PropTypes.string,
    montant: PropTypes.number,
    code_postal_lieu: PropTypes.string,
    code_paiement: PropTypes.string,
    expiration_date: PropTypes.string,
    reception_date: PropTypes.string,
    etat_ralance: PropTypes.string,
    derniere_relance_date: PropTypes.string,
    is_active: PropTypes.bool,
    conformite: PropTypes.bool,
    valide_par_SFR: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
};
export default DevisRemModal;
