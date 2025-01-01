import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const CommentsList = ({
  fetchComments,
  onAddComment,
  onDeleteComment,
  context,
  title = 'Comments',
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchComments(context);
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [fetchComments, context]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setAdding(true);
    try {
      const createdComment = await onAddComment(context, newComment);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      await onDeleteComment(context, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      {error && (
        <Typography color="error" variant="body2" mb={2}>
          {error}
        </Typography>
      )}
      <Box display="flex" mb={2}>
        <TextField
          fullWidth
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment"
          variant="outlined"
          size="small"
        />
        <Button
          onClick={handleAddComment}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          disabled={adding}
        >
          {adding ? <CircularProgress size={20} /> : 'Add'}
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {comments.map(({ id, user, dateCreated, text }) => (
            <React.Fragment key={id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${user} - ${new Date(dateCreated).toLocaleString()}`}
                  secondary={text}
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};
CommentsList.propTypes = {
  fetchComments: PropTypes.func.isRequired,
  onAddComment: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  context: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export default CommentsList;
