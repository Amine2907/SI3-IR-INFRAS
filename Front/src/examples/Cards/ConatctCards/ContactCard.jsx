import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
const ContactCard = () => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <MDBox p={2}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <MDBox
            borderRadius="lg"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="flex-start"
            p={3}
            sx={{
              border: ({ borders: { borderWidth, borderColor } }) =>
                `${borderWidth[1]} solid ${borderColor}`,
            }}
          >
            {/* Full Name */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>person</Icon> {/* Full Name Icon */}
              <MDTypography variant="h6" fontWeight="medium">
                Ahmad Tuteur
              </MDTypography>
            </MDBox>
            {/* Email */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
              <MDTypography variant="subtitle2" color="textSecondary">
                Email: johndoe@example.com
              </MDTypography>
            </MDBox>
            {/* Mission */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>work</Icon> {/* Mission Icon */}
              <MDTypography variant="subtitle2" color="textSecondary">
                Mission: Chef departement info
              </MDTypography>
            </MDBox>
            {/* Telephone */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>phone</Icon> {/* Telephone Icon */}
              <MDTypography variant="subtitle2" color="textSecondary">
                Tel: 1234567890
              </MDTypography>
            </MDBox>
            {/* Mobile */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>smartphone</Icon> {/* Mobile Icon */}
              <MDTypography variant="subtitle2" color="textSecondary">
                Mobile: 1234567890
              </MDTypography>
            </MDBox>
            {/* Active Status */}
            <MDBox display="flex" alignItems="center">
              <Icon sx={{ mr: 1 }}>check_circle</Icon> {/* Status Icon */}
              <MDTypography variant="subtitle2" color="textSecondary">
                Status: Active
              </MDTypography>
            </MDBox>
            <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
              <Tooltip title="Edit Contact" placement="top">
                <Icon
                  sx={{ cursor: 'pointer' }}
                  fontSize="small"
                  onClick={() => alert('Edit Contact')}
                >
                  edit
                </Icon>
              </Tooltip>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
};
ContactCard.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default ContactCard;
