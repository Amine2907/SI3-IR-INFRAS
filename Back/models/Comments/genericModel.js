import { supabase } from '../../config/supabaseClient.js';

// Model for adding a comment to an entity's `commentaires` column
const addComment = async (entityName, comment , Sid) => {
  try {
    // Fetch the current comments array
    const { data, error: fetchError } = await supabase
      .from(entityName)
      .select('commentaires')
    if (fetchError) throw fetchError;
    // If no comments exist, initialize as an empty array
    const currentComments = Array.isArray(data.commentaires) ? data.commentaires : [];
    // Append the new comment to the existing comments array
    const updatedComments = [...currentComments, comment]; // Appending the new comment

    // Update the entity with the new comments array
    const { error: updateError } = await supabase
      .from(entityName)
      .update({
        commentaires: updatedComments,
      })
      .eq('EB_fk',Sid)

    if (updateError) throw updateError;

    return { success: true, message: 'Comment added successfully.' };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
};
// Model for fetching comments for a specific entity
const getComments = async (entityName, Sid) => {
  try {
    const { data, error } = await supabase
      .from(entityName)
      .select('commentaires')
      .eq('EB_fk', Sid);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No comments found for entity:', entityName, 'Sid:', Sid);
      return []; // Return an empty array if no rows are found
    }
    // Filter out rows where `commentaires` is null
    const validComments = data
      .map(row => row.commentaires)
      .filter(comments => comments !== null); // Remove null values

    // Flatten the array if necessary (if `commentaires` is an array of arrays)
    const flattenedComments = validComments.flat();
    console.log('Valid comments fetched from database:', flattenedComments);
    return flattenedComments;
  } catch (error) {
    console.error('Error fetching comments from database:', error);
    return [];
  }
};
const commentModel = {
  addComment,
  getComments,
};
export default commentModel;
