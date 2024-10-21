// import React, { useEffect, useState } from 'react';
// import entityService from 'services/entityService';
// import EntiteListView from './EntiteListView';
// import EntiteModal from 'examples/popup/EntitePopUp/EntitePopUp';

// const EntiteList = () => {
//   const [entites, setEntites] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntity, setSelectedEntity] = useState(null);
//   const [alert, setAlert] = useState({ show: false, message: '', type: '' });
//   const [isActive, setIsActive] = useState(true);

//   useEffect(() => {
//     fetchActiveEntities();
//   }, []);

//   const fetchActiveEntities = async () => {
//     try {
//       const result = await entityService.getActiveEntites();
//       if (result.success) {
//         setEntites(result.data);
//       } else {
//         console.error(result.error);
//       }
//     } catch (error) {
//       console.error('Error fetching entities:', error);
//     }
//   };

//   const fetchInactiveEntities = async () => {
//     try {
//       const result = await entityService.getInactiveEntites();
//       if (result.success) {
//         setEntites(result.data);
//       } else {
//         console.error(result.error);
//       }
//     } catch (error) {
//       console.error('Error fetching entities:', error);
//     }
//   };

//   const handleToggleActiveInactive = async () => {
//     setIsActive(prevIsActive => {
//       const newIsActive = !prevIsActive;
//       if (newIsActive) {
//         fetchActiveEntities();
//       } else {
//         fetchInactiveEntities();
//       }
//       return newIsActive;
//     });
//   };

//   const handleAddEntity = () => {
//     setSelectedEntity(null);
//     setShowModal(true);
//   };

//   const handleModalClose = async () => {
//     setShowModal(false);
//     await fetchActiveEntities();
//   };

//   const handleSave = async data => {
//     let result;
//     let successMessage = '';

//     if (selectedEntity) {
//       result = await entityService.updateEntity(selectedEntity.Eid, data);
//       successMessage = 'Entity updated successfully!';
//     } else {
//       result = await entityService.createEntity(data);
//       successMessage = 'Entity saved successfully!';
//     }

//     if (result.success) {
//       setAlert({ show: true, message: successMessage, type: 'success' });
//     } else {
//       setAlert({ show: true, message: `Error: ${result.error}`, type: 'error' });
//     }

//     handleModalClose();
//   };

//   const handleCloseAlert = () => {
//     setAlert({ show: false, message: '', type: '' });
//   };
//   return (
//     <div>
//       <EntiteListView
//         entites={entites}
//         isActive={isActive}
//         onToggleActiveInactive={handleToggleActiveInactive}
//         onAddEntity={handleAddEntity}
//         onEditEntity={entite => {
//           setSelectedEntity(entite);
//           setShowModal(true);
//         }}
//         alert={alert}
//         onCloseAlert={handleCloseAlert}
//       />
//       {showModal && (
//         <EntiteModal entite={selectedEntity} onSave={handleSave} onClose={handleModalClose} />
//       )}
//     </div>
//   );
// };

// export default EntiteList;
