// controllers/commentController.js
import commentModel from '../../models/Comments/genericModel.js';
import { supabase } from '../../config/supabaseClient.js';
// Add a comment to an entity
const addComment = async (req, res) => {
  const { entityName,  comment , Sid } = req.body;
  if (!entityName || !comment || !Sid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Fetch the authenticated user's data
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    // Handle error if user is not authenticated or doesn't exist
    if (userError || !user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Add the comment to the database (in the `commentaires` column of the entity)
    const result = await commentModel.addComment(entityName, comment , Sid);
    if (!result) {
      console.log('Failed to add comment');
      return res.status(500).json({ error: 'Failed to add comment' });
    }
    res.status(200).json({ message: 'Comment added successfully', result });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Get comments for an entity
const getComments = async (req, res) => {
  const { entityName, Sid } = req.query;
  if (!entityName || !Sid) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  try {
    const comments = await commentModel.getComments(entityName, Sid);
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
