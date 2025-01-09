import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  Typography,
  Box,
  TableRow,
  TextField,
} from '@mui/material';
import commentService from 'services/Commentary/commentService';
import { cellStyle, commentStyle } from './styles';
import { Alert, AlertDescription } from 'components/ui/alert';
import { useAuth } from 'context/Auth/AuthContext';
import MDButton from 'components/MDButton';
const CommentSection = ({ entityName, Sid }) => {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log('Fetching comments for:', { entityName, Sid });
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
    // Ensure the user is available from AuthContext
    if (authLoading || !user) {
      console.error('No user logged in');
      return;
    }
    // Get the current date and time
    const currentDate = new Date().toLocaleString();
    const commentWithDate = `${newComment} (Added on: ${currentDate}) (Added by: ${
      user.email || 'Unknown'
    })`;
    setIsSaving(true);
    try {
      console.log('Fetching comments for:', { entityName, Sid });
      await commentService.addComment(entityName, commentWithDate, user.email, Sid);
      // Update the state with the new comment
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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Commentaires
      </Typography>
      <TextField
        label="Ajouter un commentaire"
        fullWidth
        multiline
        rows={4}
        value={newComment}
        onChange={handleCommentChange}
        disabled={isSaving}
        sx={{ mb: 2 }}
      />
      <Box mb={2} display="flex" justifyContent="space-between">
        <MDButton
          onClick={handleCommentSubmit}
          variant="contained"
          color="dark"
          disabled={isSaving || !newComment}
        >
          {isSaving ? 'Saving...' : 'Enregistrer'}
        </MDButton>
        <MDButton onClick={() => setNewComment('')} variant="outlined" color="secondary">
          Effacer
        </MDButton>
      </Box>
      {comments.length === 0 ? (
        <Alert variant="destructive">
          <AlertDescription>Pas de commentaires pour ce Site.</AlertDescription>
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={cellStyle}>Utilisateur</TableCell>
                <TableCell sx={cellStyle}>Date</TableCell>
                <TableCell sx={cellStyle}>Commentaire</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comments.map((comment, index) => {
                const dateMatch = comment.match(/\(Added on: (.*?)\)/);
                const date = dateMatch ? dateMatch[1] : 'N/A';
                const userMatch = comment.match(/\(Added by: (.*?)\)/);
                const user = userMatch ? userMatch[1] : 'Unknown';
                const commentText =
                  comment
                    .replace(/\(Added on: .*?\)/, '')
                    .replace(/\(Added by: .*?\)/, '')
                    .trim() || 'N/A';

                return (
                  <TableRow key={index}>
                    <TableCell sx={commentStyle}>{user}</TableCell>
                    <TableCell sx={commentStyle}>{date}</TableCell>
                    <TableCell sx={commentStyle}>{commentText}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
CommentSection.propTypes = {
  entityName: PropTypes.string.isRequired,
  Sid: PropTypes.number.isRequired,
};
export default CommentSection;
