// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// @mui material components
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import { Button } from '@mui/material';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function ComplexStatisticsCard({ color, title, count, icon, onClick }) {
  return (
    <Card>
      <MDBox display="flex" alignItems="center" justifyContent="space-between" pt={2} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === 'light' ? 'dark' : 'white'}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          position="relative"
          overflow="hidden"
        >
          <Button
            onClick={onClick}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          />
          <Icon fontSize="large" sx={{ zIndex: 2 }}>
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25} ml={2}>
          <MDTypography variant="button" fontWeight="regular" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4" fontWeight="bold">
            {count}
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider sx={{ mt: 1 }} />
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: 'info',
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default ComplexStatisticsCard;
