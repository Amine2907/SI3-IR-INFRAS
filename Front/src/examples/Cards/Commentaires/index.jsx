import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import prop-types
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
  const [loading, setLoading] = useState(true); // Manage loading state for fetching comments
  const [isSaving, setIsSaving] = useState(false); // Manage saving state

  // Fetch comments for the given entity
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await commentService.getComments(entityName, entityId);
        setComments(fetchedComments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };
    fetchComments();
  }, [entityName, entityId]);

  // Handle the input change for adding a new comment
  const handleCommentChange = event => {
    setNewComment(event.target.value);
  };

  // Submit the comment
  const handleCommentSubmit = async () => {
    if (!newComment) return;

    setIsSaving(true); // Start saving

    try {
      const result = await commentService.addComment(entityName, entityId, newComment);
      setComments([result.comment, ...comments]); // Add the new comment to the beginning of the list
      setNewComment(''); // Reset the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSaving(false); // Stop saving
    }
  };

  const handleDeleteComment = async comment => {
    // Call the delete function from your service (assuming you have it)
    console.log('Deleting comment:', comment);
    // Implement delete functionality here
  };

  return (
    <Box>
      {/* Loading indicator */}
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
