import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';
import commentService from 'services/Commentary/commentService';

const CommentSection = ({ entityName, entityId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments for the given entity
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await commentService.getComments(entityName, entityId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [entityName, entityId]);

  // Handle the input change for adding a new comment
  const handleCommentChange = event => {
    setNewComment(event.target.value);
  };

  // Submit a new comment
  const handleCommentSubmit = async () => {
    if (!newComment) return;

    try {
      const result = await commentService.addComment(entityName, entityId, newComment);
      setComments([result.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">Comments</Typography>
      <TextField
        label="Add a Comment"
        fullWidth
        multiline
        rows={4}
        value={newComment}
        onChange={handleCommentChange}
      />
      <Button
        onClick={handleCommentSubmit}
        variant="contained"
        color="primary"
        style={{ marginTop: '10px' }}
      >
        Submit
      </Button>

      <List>
        {comments.map((comment, index) => (
          <ListItem key={index}>
            <Typography variant="body2">{comment}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
export default CommentSection;
