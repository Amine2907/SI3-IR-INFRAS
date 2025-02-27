import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function ProfileInfoCard({ title, info, action, shadow, icons }) {
  const labels = [];
  const values = [];

  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach(el => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find(i => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });

  // Push the object values into the values array
  Object.values(info).forEach(el => values.push(el));

  // Render the card info items with icons
  const renderItems = labels.map((label, key) => (
    <MDBox key={label} display="flex" flexDirection="row" alignItems="center" py={1} pr={2}>
      {icons && icons[label] && <Icon sx={{ mr: 1 }}>{icons[label]}</Icon>}
      <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </MDTypography>
      <MDTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{values[key]}
      </MDTypography>
    </MDBox>
  ));

  return (
    <Card sx={{ height: '100%', boxShadow: !shadow && 'none' }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {action.route ? (
          <MDTypography component={Link} to={action.route} variant="body2" color="secondary">
            <Tooltip title={action.tooltip} placement="top">
              <Icon>edit</Icon>
            </Tooltip>
          </MDTypography>
        ) : (
          <MDTypography
            variant="body2"
            color="secondary"
            onClick={action.onClick}
            sx={{ cursor: 'pointer' }}
          >
            <Tooltip title={action.tooltip} placement="top">
              <Icon>edit</Icon>
            </Tooltip>
          </MDTypography>
        )}
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}></MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox>
          {renderItems}
          <MDBox display="flex" py={1} pr={2}></MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  action: { onClick: null, route: '', tooltip: '' }, // Default action props
  icons: {},
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string, // route is not always required now
    onClick: PropTypes.func, // onClick can be passed instead of route
    tooltip: PropTypes.string.isRequired,
  }),
  shadow: PropTypes.bool,
  icons: PropTypes.objectOf(PropTypes.string), // Adding icons prop type
};

export default ProfileInfoCard;
