import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  List,
  ListItem,
  Button,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import commentService from 'services/Commentary/commentService';

const CommentSection = ({ entityName, entityId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch comments for the given entity
  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for entityName:', entityName);
      console.log('Fetching comments for entityId:', entityId);
      try {
        const fetchedComments = await commentService.getComments(entityName, entityId);
        console.log('Fetched Comments:', fetchedComments); // Log the fetched comments
        setComments(fetchedComments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };
    // Fetch comments when entityName or entityId changes
    if (entityName && entityId) {
      fetchComments();
    }
  }, [entityName, entityId]);

  // Handle the input change for adding a new comment
  const handleCommentChange = event => {
    setNewComment(event.target.value);
    console.log('New Comment being typed:', event.target.value);
  };

  // Submit the comment
  const handleCommentSubmit = async () => {
    if (!newComment) return;
    console.log('Entity Name:', entityName);
    console.log('Entity ID:', entityId); // Log entityName and entityId

    setIsSaving(true);
    console.log('Submitting new comment:', newComment);
    try {
      const result = await commentService.addComment(entityName, entityId, newComment);
      setComments([result.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = async comment => {
    console.log('Deleting comment:', comment); // Log the comment to be deleted
    // Handle delete comment logic here
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* List of existing comments */}
          <Typography variant="h6">Comments</Typography>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <Typography variant="body2">{comment}</Typography>
                <Button
                  onClick={() => handleDeleteComment(comment)}
                  color="error"
                  variant="outlined"
                  size="small"
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
          {/* Input for new comment */}
          <TextField
            label="Add a Comment"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={handleCommentChange}
            disabled={isSaving} // Disable input while saving
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={handleCommentSubmit}
              variant="contained"
              color="primary"
              disabled={isSaving || !newComment}
            >
              {isSaving ? 'Saving...' : 'Enregistrer'}
            </Button>
            <Button onClick={() => setNewComment('')} variant="outlined" color="secondary">
              Clear
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
// Define the PropTypes for the component
CommentSection.propTypes = {
  entityName: PropTypes.string.isRequired,
  entityId: PropTypes.number.isRequired,
};

export default CommentSection;
