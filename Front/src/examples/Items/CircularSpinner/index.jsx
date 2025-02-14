import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw">
      <CircularProgress size={50} />
    </Box>
  );
};

export default LoadingSpinner;
