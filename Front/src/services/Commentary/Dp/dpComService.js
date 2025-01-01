import axios from 'axios';

const API_URL = 'http://localhost:5000/api/com';

export const fetchDpComments = async (dpId) => {
  try {
    const response = await axios.get(`${API_URL}/comments?context=${dpId}`);
    return response.data.data; // Adjust according to your API's response format
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

export const addDpComment = async (dpId, comment) => {
  try {
    const payload = { dpId, text: comment };
    const response = await axios.post(`${API_URL}/comments`, payload);
    return response.data.data; // Adjust according to your API's response format
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

export const deleteDpComment = async (commentId) => {
  try {
    await axios.delete(`${API_URL}/comments/${commentId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
};
