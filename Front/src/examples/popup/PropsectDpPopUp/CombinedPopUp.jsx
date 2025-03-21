/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import ProsUModal from './ProsPopUp';
import DpModal from './DpPopUp';

const CombinedModal = ({ prospect, Proid, dp, onSaveProspect, onSaveDp, onClose, open }) => {
  const [currentTab, setCurrentTab] = React.useState('prospect');
  if (!open) return null;
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: '800px',
        borderRadius: 2,
      }}
    >
      {/* Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Prospect" value="prospect" />
        <Tab label="Déclaration Préalable" value="dp" />
      </Tabs>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {currentTab === 'prospect' && (
          <>
            <Typography variant="h6" gutterBottom align="center">
              Modifier Prospect
            </Typography>
            <ProsUModal prospect={prospect} onSave={onSaveProspect} onClose={onClose} />
          </>
        )}
        {currentTab === 'dp' && (
          <>
            <Typography variant="h6" gutterBottom align="center">
              Ajouter Déclaration Préalable
            </Typography>
            <DpModal Proid={Proid} dp={dp} onSave={onSaveDp} onClose={onClose} />
          </>
        )}
      </Paper>
    </Box>
  );
};
CombinedModal.propTypes = {
  prospect: PropTypes.object,
  dp: PropTypes.object,
  onSaveProspect: PropTypes.func.isRequired,
  onSaveDp: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
export default CombinedModal;
