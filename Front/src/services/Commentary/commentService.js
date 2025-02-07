import axios from 'axios';
const API_URL = `${process.env.BACKEND_URL}/api/coms`;

// Add a comment for a specific entity (POST request)
const addComment = async (entityName, comment, user, Sid) => {
  try {
    console.log('Sending POST request to:', `${API_URL}/comments`, {
      entityName,
      comment,
      user,
      Sid,
    });
    const response = await axios.post(`${API_URL}/comments`, {
      entityName,
      comment,
      user,
      Sid,
    });
    console.log('Comment added successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error.response?.data || error.message);
    throw error;
  }
};
// Get comments for a specific entity (GET request)
const getComments = async (entityName, Sid) => {
  try {
    console.log('Sending GET request to:', `${API_URL}/comments`);
    const response = await axios.get(`${API_URL}/comments`, {
      params: { entityName, Sid },
    });
    console.log('Fetched comments successfully:', response.data);
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
