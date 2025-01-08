import { supabase } from '../../config/supabaseClient.js';
import {entityMapping} from './entityMapping.js';

// Model for adding a comment to an entity's `commentaires` column
const addComment = async (entityName, entityId, comment) => {
  try {
    const primaryKey = entityMapping[entityName];
    if (!primaryKey) {
      throw new Error(`Invalid entity name: ${entityName}`);
    }
    // Fetch the current comments array
    const { data, error: fetchError } = await supabase
      .from(entityName)
      .select('commentaires')
      .eq(primaryKey, entityId)
      .single();

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
      .eq(primaryKey, entityId);

    if (updateError) throw updateError;

    return { success: true, message: 'Comment added successfully.' };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, message: error.message || 'Internal server error' };
  }
};
// Model for fetching comments for a specific entity
const getComments = async (entityName, entityId) => {
  try {
    const primaryKey = entityMapping[entityName];
    if (!primaryKey) {
      throw new Error(`Invalid entity name: ${entityName}`);
    }
    const { data, error } = await supabase
      .from(entityName)
      .select('commentaires')
      .eq(primaryKey, entityId);

    if (error) throw error;

    return data ? data[0]?.commentaires : [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

const commentModel = {
  addComment,
  getComments,
};

export default commentModel;
