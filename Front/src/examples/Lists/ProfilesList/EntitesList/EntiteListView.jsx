// import React from 'react';
// import { Grid, Switch, Icon } from '@mui/material';
// import Card from '@mui/material/Card';
// import MDBox from 'components/MDBox';
// import MDTypography from 'components/MDTypography';
// import MDButton from 'components/MDButton';
// import EntiteCard from 'examples/Cards/EntiteCard/EntiteCard';
// import MDAlert from 'components/MDAlert';
// import PropTypes from 'prop-types';

// const EntiteListView = ({
//   entites = [], // Set a default value of an empty array
//   isActive = true, // Set a default value of true
//   onToggleActiveInactive,
//   onAddEntity,
//   onEditEntity,
//   alert,
//   onCloseAlert,
// }) => {
//   return (
//     <div className="entite-list">
//       <Card id="delete-account">
//         <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
//           <MDTypography variant="h6" fontWeight="medium">
//             Entites
//           </MDTypography>
//           <MDButton onClick={onAddEntity} variant="gradient" color="dark">
//             <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
//             &nbsp;Ajouter Entite
//           </MDButton>
//         </MDBox>
//         <MDBox p={2}>
//           <MDTypography variant="h6" fontWeight="medium">
//             {isActive ? 'Active' : 'Inactive'}
//           </MDTypography>
//           <Switch
//             type="checkbox"
//             checked={isActive}
//             onChange={onToggleActiveInactive}
//             style={{ marginRight: '10px' }}
//           />
//           <Grid container spacing={3}>
//             {entites.length > 0 ? ( // Check for length instead of existence
//               entites.map(entite => (
//                 <Grid item xs={12} sm={8} md={4} key={entite.id}>
//                   <EntiteCard
//                     entite={entite}
//                     onEdit={() => onEditEntity(entite)} // Handle edit action
//                   />
//                 </Grid>
//               ))
//             ) : (
//               <MDTypography variant="body1">No entities found.</MDTypography>
//             )}
//           </Grid>
//         </MDBox>
//       </Card>
//       {alert && alert.show && (
//         <MDAlert
//           color={alert.type}
//           dismissible
//           onClose={onCloseAlert}
//           style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}
//         >
//           {alert.message}
//         </MDAlert>
//       )}
//     </div>
//   );
// };
// EntiteListView.propTypes = {
//   entites: PropTypes.array,
//   isActive: PropTypes.bool,
//   onToggleActiveInactive: PropTypes.func.isRequired,
//   onAddEntity: PropTypes.func.isRequired,
//   onEditEntity: PropTypes.func.isRequired,
//   alert: PropTypes.shape({
//     show: PropTypes.bool.isRequired,
//     message: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired,
//   }).isRequired,
//   onCloseAlert: PropTypes.func.isRequired,
// };

// export default EntiteListView;
