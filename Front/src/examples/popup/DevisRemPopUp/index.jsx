/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './remStyles.module.css';
import PropTypes from 'prop-types';
import MDInput from 'components/MDInput';
import MDTypography from 'components/MDTypography';
import SiteDevisService from 'services/site_details/Devis/DevisService';
import MDButton from 'components/MDButton';

const DevisRemModal = ({ ND, Sid, devis, onClose }) => {
  const [facturesForDevis, setFacturesForDevis] = useState([]);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const result = await SiteDevisService.getFactureDetails(ND);
        if (result.success) {
          setFacturesForDevis(result.data || []);
        } else {
          console.error('Error fetching facture details:', result.error);
        }
      } catch (error) {
        console.error('Error during fetch:', error.message);
      }
    };

    fetchFactureDetails();
  }, [ND, Sid]);

  const totalFactureTtc = facturesForDevis.reduce(
    (acc, facture) => acc + (facture.montant_ttc || 0),
    0
  );
  const remboursementDevis = devis.montant - totalFactureTtc;
  const remboursementsFactures = facturesForDevis.map(facture => {
    const remboursementFacture = devis.montant - (facture.montant_ttc || 0);
    return {
      ...facture,
      remboursement: remboursementFacture > 0 ? remboursementFacture : 0,
    };
  });

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDButton
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          &times;
        </MDButton>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center" gutterBottom>
          Détails du Remboursement
        </MDTypography>
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="remboursement">
              Remboursement
            </label>
            <MDInput
              id="remboursement"
              name="remboursement"
              value={remboursementDevis || 0}
              style={{ width: '100%' }}
              disabled
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="ND">
              Numéro de Devis
            </label>
            <MDInput id="ND" name="ND" value={devis.ND || ''} style={{ width: '100%' }} disabled />
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel} htmlFor="montant_ttc_devis">
              Montant TTC du Devis
            </label>
            <MDInput
              id="montant_ttc_devis"
              name="montant_ttc_devis"
              value={devis.montant || ''}
              style={{ width: '100%' }}
              disabled
            />
          </div>
          {remboursementsFactures.map((facture, index) => (
            <div key={facture.Fid || index}>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor={`no_fac_${index}`}>
                  Numéro de Facture {index + 1}
                </label>
                <MDInput
                  id={`no_fac_${index}`}
                  name={`no_fac_${index}`}
                  value={facture.no_fac || ''}
                  style={{ width: '100%' }}
                  disabled
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor={`montant_ht_${index}`}>
                  Montant HT Facture {index + 1}
                </label>
                <MDInput
                  id={`montant_ht_${index}`}
                  name={`montant_ht_${index}`}
                  value={facture.montant_ht || ''}
                  style={{ width: '100%' }}
                  disabled
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor={`montant_ttc_${index}`}>
                  Montant TTC Facture {index + 1}
                </label>
                <MDInput
                  id={`montant_ttc_${index}`}
                  name={`montant_ttc_${index}`}
                  value={facture.montant_ttc || ''}
                  style={{ width: '100%' }}
                  disabled
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.formLabel} htmlFor={`remboursement_facture_${index}`}>
                  Remboursement Facture {index + 1}
                </label>
                <MDInput
                  id={`remboursement_facture_${index}`}
                  name={`remboursement_facture_${index}`}
                  value={facture.remboursement || 0}
                  style={{ width: '100%' }}
                  disabled
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

DevisRemModal.propTypes = {
  ND: PropTypes.string.isRequired,
  Sid: PropTypes.string.isRequired,
  devis: PropTypes.shape({
    ND: PropTypes.number,
    montant: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DevisRemModal;
