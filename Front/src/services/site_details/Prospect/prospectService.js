import axios from 'axios';
const API_URL = 'http://localhost:5000/api/prospect';
// const addExistingSiteContacts = async ({ Sid, Cids }) => {
//   try {
//     // Ensure Sid and Cids are not undefined
//     if (!Sid || !Array.isArray(Cids) || Cids.length === 0) {
//       throw new Error('Sid and an array of Cids are required');
//     }
//     // Send the request to the backend with the correct payload structure
//     const response = await axios.post(`${API_URL}/add-contact-site`, { Sid, Cids });
//     // Handle the response from the backend
//     if (response.data && response.data.data) {
//       return { success: true, data: response.data.data };
//     } else {Z
//       return { success: false, error: 'No response data received from server' };
//     }
//   } catch (error) {
//     console.error('Error associating contacts:', error.message);
//     return {
//       success: false,
//       error: error.response ? error.response.data.error : error.message,
//     };
//   }
// };
const createProspect = async ({ Sid, prospectData }) => {Z
  try {
    const response = await axios.post(`${API_URL}/create-prospect-site`, {
      Sid,
      prospectData,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response ? error.response.data.error : error.message };
  }
};
// const deleteContactSite = async (Sid, Cid) => {
//   try {
//     const response = await axios.delete(`${API_URL}/delete-contact-site`, {
//       data: { Sid, Cid },
//     });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, error: error.response ? error.response.data.error : error.message };
//   }
// };
// const getContactsSite = async Sid => {
//   try {
//     const response = await axios.get(`${API_URL}/${Sid}/contacts`);
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, error: error.response ? error.response.data.error : error.message };
//   }
// };
// const displayContactsSite = async (Sid, Cid) => {
//   try {
//     const response = await axios.get(`${API_URL}/${Sid}/contact`, {
//       data: { Cid },
//     });
//     return { success: true, data: response.data };
//   } catch (error) {
//     return { success: false, error: error.response ? error.response.data.error : error.message };
//   }
// };
const SiteProspectService = {
  createProspect,
};
export default SiteProspectService;
