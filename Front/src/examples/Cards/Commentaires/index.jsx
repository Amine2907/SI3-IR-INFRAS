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
import { Alert, AlertDescription } from 'components/ui/alert';
const CommentSection = ({ entityName, entityId, Sid }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for entityName:', entityName);
      console.log('Fetching comments for entityId:', Sid);
      try {
        const fetchedComments = await commentService.getComments(entityName, Sid);
        setComments(fetchedComments || []); // Ensure comments is always an array
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]); // Default to an empty array on error
      }
    };
    // Fetch comments when entityName or Sid changes
    if (entityName && Sid) {
      fetchComments();
    }
  }, [entityName, Sid]);

  // Handle the input change for adding a new comment
  const handleCommentChange = event => {
    setNewComment(event.target.value);
    console.log('New Comment being typed:', event.target.value);
  };
  // Submit the comment
  const handleCommentSubmit = async () => {
    if (!newComment) return;

    // Get the current date and time
    const currentDate = new Date().toLocaleString(); // You can format this as needed

    // Combine the comment with the current date
    const commentWithDate = `${newComment} (Added on: ${currentDate})`;

    console.log('Entity Name:', entityName);
    console.log('Entity ID:', entityId);

    setIsSaving(true);
    console.log('Submitting new comment:', commentWithDate);

    try {
      // Add the comment with date to the array of comments in the `commentaires` column
      await commentService.addComment(entityName, entityId, commentWithDate);

      // Add the new comment to the list of comments (no need for separate date logic)
      setComments([commentWithDate, ...comments]);
      setNewComment(''); // Clear the input
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSaving(false);
    }
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
        {/* Conditional rendering of Alert if no comments */}
        {comments.length === 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>Pas de commentaires pour ce site.</AlertDescription>
          </Alert>
        )}
      </Box>
      <List>
        {comments.length > 0 && (
          <TableRow>
            <TableCell sx={cellStyle}>Utilsateur</TableCell>
            <TableCell sx={cellStyle}>Date</TableCell>
            <TableCell sx={cellStyle}>Commentaire</TableCell>
          </TableRow>
        )}
        {comments.map((comment, index) => {
          const dateMatch = comment.match(/\(Added on: (.*?)\)/);
          const date = dateMatch ? dateMatch[1] : 'N/A';
          return (
            <ListItem key={index}>
              <TableRow>
                <TableCell>{date}</TableCell>
                <TableCell sx={commentStyle}>
                  {comment.replace(/\(Added on: .*\)/, '') || 'N/A'}
                </TableCell>
              </TableRow>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};
// Define the PropTypes for the component
CommentSection.propTypes = {
  entityName: PropTypes.string.isRequired,
  entityId: PropTypes.number.isRequired,
  Sid: PropTypes.number.isRequired,
};
export default CommentSection;
