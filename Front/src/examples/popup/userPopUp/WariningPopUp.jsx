import React from 'react';
import PropTypes from 'prop-types';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import styles from '../style.module.css';

const WarningPopUp = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <MDTypography variant="h3" fontWeight="medium" textAlign="center">
          {message}
        </MDTypography>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <MDButton
            onClick={onCancel}
            variant="gradient"
            color="secondary"
            style={{ minWidth: '100px' }}
          >
            Non
          </MDButton>
          <MDButton
            onClick={onConfirm}
            variant="gradient"
            color="error"
            style={{ minWidth: '100px' }}
          >
            Oui
          </MDButton>
        </div>
      </div>
    </div>
  );
};
WarningPopUp.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
export default WarningPopUp;
