import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { useMaterialUIController } from '../../../context/index';
import Card from '@mui/material/Card';
const ContactCard = ({ contact, onEdit }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (
    <Grid item xs={12}>
      <Card id="contact_card">
        <MDBox p={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
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
                    {contact.nom}&nbsp;
                    {contact.prenom}
                  </MDTypography>
                </MDBox>
                {/* Email */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>email</Icon> {/* Email Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Email: {contact.email}
                  </MDTypography>
                </MDBox>
                {/* Position */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>work</Icon> {/* Position Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Position: {contact.mission}
                  </MDTypography>
                </MDBox>
                {/* Phone */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Tel: {contact.tel}
                  </MDTypography>
                </MDBox>
                {/* Mobile */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>phone_iphone</Icon> {/* Phone Icon */}
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Mobile: {contact.mobile}
                  </MDTypography>
                </MDBox>
                {/* Active Status */}
                <MDBox display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>check_circle</Icon>
                  <MDTypography variant="subtitle2" color="textSecondary">
                    Status: {contact.is_active ? 'Active' : 'Inactive'}
                  </MDTypography>
                </MDBox>
                <MDBox ml="auto" lineHeight={0} color={darkMode ? 'white' : 'dark'}>
                  <Tooltip title="Edit Contact" placement="top">
                    <Icon sx={{ cursor: 'pointer' }} fontSize="small" onClick={onEdit}>
                      edit
                    </Icon>
                  </Tooltip>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </Grid>
  );
};
ContactCard.propTypes = {
  contact: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    tel: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    mission: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
export default ContactCard;
