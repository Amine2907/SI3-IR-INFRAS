import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import DpModal from './DpPopUp';
import ProsUModal from './ProsPopUp';

const CombinedModal = ({ prospect, dp, onSaveProspect, onSaveDp, onClose }) => {
  const [activeTab, setActiveTab] = useState('prospect');

  const handleTabSwitch = tab => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <MDTypography
            variant="h4"
            className={`${styles.tab} ${activeTab === 'prospect' ? styles.activeTab : ''}`}
            onClick={() => handleTabSwitch('prospect')}
          >
            Modifier Prospect
          </MDTypography>
          <MDTypography
            variant="h4"
            className={`${styles.tab} ${activeTab === 'dp' ? styles.activeTab : ''}`}
            onClick={() => handleTabSwitch('dp')}
          >
            Ajouter DP
          </MDTypography>
        </div>
        <div className={styles.modalBody}>
          {activeTab === 'prospect' ? (
            <ProsUModal prospect={prospect} onSave={onSaveProspect} onClose={onClose} />
          ) : (
            <DpModal dp={dp} onSave={onSaveDp} onClose={onClose} />
          )}
        </div>
        <div className={styles.modalFooter}>
          <MDButton onClick={onClose} variant="gradient" color="dark">
            Fermer
          </MDButton>
        </div>
      </div>
    </div>
  );
};
CombinedModal.propTypes = {
  prospect: PropTypes.object,
  dp: PropTypes.object,
  onSaveProspect: PropTypes.func.isRequired,
  onSaveDp: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CombinedModal;
