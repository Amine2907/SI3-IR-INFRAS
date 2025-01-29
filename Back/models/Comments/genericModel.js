import { supabase } from '../../config/supabaseClient.js';

// Model for adding a comment to an entity's `commentaires` column
const addComment = async (entityName, comment, Sid) => {
  try {
    // Fetch the first matching row based on Sid
    const { data, error: fetchError } = await supabase
      .from(entityName)
      .select('commentaires') 
      .eq('EB_fk', Sid)
      .limit(1)
      .single();
    if (fetchError) throw fetchError;
    // Ensure `commentaires` is initialized as an array
    const currentComments = Array.isArray(data.commentaires) ? data.commentaires : [];
    // Append the new comment to the existing comments array
    const updatedComments = [...currentComments, comment];
    // Update the entity with the new comments array
    const { error: updateError } = await supabase
      .from(entityName)
      .update({
        commentaires: updatedComments,
      })
      .eq('EB_fk', Sid );

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
      .eq('EB_fk', Sid) 
      .limit(1)
      .single();
    if (error) throw error;
    if (!data || !data.commentaires) {
      return [];
    }
    return data.commentaires;
  } catch (error) {
    console.error('Error fetching comments from the first row:', error);
    return [];
  }
};
const commentModel = {
  addComment,
  getComments,
};
export default commentModel;
