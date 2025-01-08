// models/commentModel.js
import { supabase } from '../../config/supabaseClient.js';

// Model for adding a comment to an entity's `commentaires` column
const addComment = async (entityName, entityId, comment) => {
  try {
    const { data, error } = await supabase
      .from(entityName)
      .update({
        commentaires: supabase.raw('array_append(commentaires, ?)', [comment]),
      })
      .eq('id', entityId);

    if (error) throw error;

    return data;  // Return updated entity
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
};

// Model for fetching comments for a specific entity
const getComments = async (entityName, entityId) => {
  try {
    const { data, error } = await supabase
      .from(entityName)
      .select('commentaires')
      .eq('id', entityId);

    if (error) throw error;

    return data ? data[0]?.commentaires : [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};
const commentModel = {
  addComment ,
  getComments
}
export default commentModel

