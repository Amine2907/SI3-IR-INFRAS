import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  List,
  ListItem,
  Button,
  Typography,
  Box,
  TableCell,
  TableRow,
} from '@mui/material';
import commentService from 'services/Commentary/commentService';
import { cellStyle, commentStyle } from './styles';
const CommentSection = ({ entityName, entityId, entitySubName }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for entityName:', entityName);
      console.log('Fetching comments for entityId:', entityId);
      try {
        const fetchedComments = await commentService.getComments(entityName, entityId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
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
    console.log('Entity ID:', entityId);

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
    console.log('Deleting comment:', comment);
    // Handle delete comment logic here
  };
  return (
    <Box>
      <Typography variant="h6">Commentaires</Typography>
      <TextField
        label="Ajouter un commentaire"
        fullWidth
        multiline
        rows={4}
        value={newComment}
        onChange={handleCommentChange}
        disabled={isSaving}
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
      <List>
        {comments.length > 0 && (
          <TableRow>
            <TableCell sx={cellStyle}>Associe a </TableCell>
            <TableCell sx={cellStyle}>Date</TableCell>
            <TableCell sx={cellStyle}>Commentaire</TableCell>
          </TableRow>
        )}
        {comments.map((comment, index) => (
          <ListItem key={index}>
            <TableRow key={index}>
              <TableCell>{entitySubName || 'N/A'}</TableCell>
              <TableCell>{'comment'}</TableCell>
              <TableCell sx={commentStyle}>{comment || 'N/A'}</TableCell>
            </TableRow>
            <Button
              onClick={() => handleDeleteComment(comment)}
              color="error"
              variant="outlined"
              size="small"
            >
              Supprimer
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
// Define the PropTypes for the component
CommentSection.propTypes = {
  entityName: PropTypes.string.isRequired,
  entityId: PropTypes.number.isRequired,
  entitySubName: PropTypes.string.isRequired,
};
export default CommentSection;
