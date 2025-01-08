// services/commentService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coms';

// Add a comment for a specific entity (POST request)
const addComment = async (entityName, entityId, comment) => {
  try {
    const response = await axios.post(`${API_URL}/comments`, {
      entityName,
      entityId,
      comment,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
// Get comments for a specific entity (GET request)
const getComments = async (entityName, entityId) => {
  try {
    const response = await axios.get(`${API_URL}/comments`, {
      params: { entityName, entityId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};
const commentService = {
  addComment,
  getComments,
};
export default commentService;
