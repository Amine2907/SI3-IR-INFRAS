// controllers/commentController.js
import commentModel from '../../models/Comments/genericModel.js';
// Add a comment to an entity
const addComment = async (req, res) => {
  const { entityName, entityId, comment } = req.body;

  if (!entityName || !entityId || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await commentModel.addComment(entityName, entityId, comment);
    if (!result) {
      return res.status(500).json({ error: 'Failed to add comment' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get comments for an entity
const getComments = async (req, res) => {
  const { entityName, entityId } = req.query;
  if (!entityName || !entityId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    const comments = await commentModel.getComments(entityName, entityId);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const commentController = {
  addComment,
  getComments,
}
export default commentController
