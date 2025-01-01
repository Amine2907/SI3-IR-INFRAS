import axios from 'axios';

const API_URL = 'http://localhost:5000/api/com';

/**
 * Fetch all comments from the "comments" table.
 * @param {string} dpId - The context or identifier for filtering comments.
 * @returns {Promise<Array>} - Array of comments.
 */
export const fetchDpComments = async dpId => {
  try {
    const response = await axios.get(`${API_URL}/comments`, { params: { context: dpId } });
    return response.data.data; // Adjust according to your API's response format
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

/**
 * Add a comment to the "comments" table.
 * @param {string} dpId - The context or identifier for the comment.
 * @param {string} comment - The text of the comment.
 * @returns {Promise<Object>} - Created comment object.
 */
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

/**
 * Fetch a specific comment by its ID from the "comments" table.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<Object>} - Comment object.
 */
export const fetchCommentById = async commentId => {
  try {
    const response = await axios.get(`${API_URL}/comments/${commentId}`);
    return response.data.data; // Adjust according to your API's response format
  } catch (error) {
    console.error('Error fetching comment by ID:', error);
    throw new Error('Failed to fetch comment by ID');
  }
};

/**
 * Update a comment by its ID in the "comments" table.
 * @param {string} commentId - The ID of the comment.
 * @param {Object} updatedData - The updated data for the comment.
 * @returns {Promise<Object>} - Updated comment object.
 */
export const updateDpComment = async (commentId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/comments/${commentId}`, updatedData);
    return response.data.data; // Adjust according to your API's response format
  } catch (error) {
    console.error('Error updating comment:', error);
    throw new Error('Failed to update comment');
  }
};

/**
 * Delete a comment by its ID from the "comments" table.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<void>} - No return data.
 */
export const deleteDpComment = async commentId => {
  try {
    await axios.delete(`${API_URL}/comments/${commentId}`);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
};
