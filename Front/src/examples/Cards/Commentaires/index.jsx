/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Textarea } from 'components/ui/textarea';
import { Button } from 'components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Alert, AlertDescription } from 'components/ui/alert';
import { Loader2 } from 'lucide-react';
import commentService from 'services/Commentary/commentService';
import { useAuth } from 'context/Auth/AuthContext';
import settingsService from 'services/Settings/settingsService';

const CommentSection = ({ entityName, Sid }) => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMapping, setUserMapping] = useState({});

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await settingsService.getAccountInfo(user.id);
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          console.error(response.error?.message || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('An error occurred while fetching user data:', err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.error('User is not available');
    }
  }, [user]);

  // Fetch comments on load or when entityName/Sid changes
  useEffect(() => {
    const fetchCommentsAndUsers = async () => {
      try {
        const fetchedComments = await commentService.getComments(entityName, Sid);

        if (fetchedComments.length > 0) {
          // Extract unique emails from comments
          const emails = [
            ...new Set(
              fetchedComments.map(comment => {
                const match = comment.match(/\(Added by: (.*?)\)/);
                return match ? match[1] : null;
              })
            ),
          ].filter(email => email);

          // Fetch user details for each email
          const userResponses = await Promise.all(
            emails.map(email => settingsService.getAccountInfo(email))
          );

          // Create email-to-user mapping
          const emailToUserMap = userResponses.reduce((map, response) => {
            if (response?.data) {
              map[response.data.email] = `${response.data.firstName} ${response.data.lastName}`;
            }
            return map;
          }, {});

          setUserMapping(emailToUserMap);
        }
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments or user data:', error);
        setComments([]);
      }
    };

    if (entityName && Sid) {
      fetchCommentsAndUsers();
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
      console.log('Submitting comment for:', { entityName, Sid });
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

  if (loading) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Loading user data...</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Commentaires</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Ajouter un commentaire"
          value={newComment}
          onChange={handleCommentChange}
          disabled={isSaving}
          className="mb-4"
          rows={4}
        />
        <div className="flex justify-end mb-6">
          <Button onClick={handleCommentSubmit} disabled={isSaving || !newComment}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </div>

        {comments.length === 0 ? (
          <Alert variant="destructive">
            <AlertDescription>Pas de commentaires pour ce Site.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {comments.map((comment, index) => {
              const dateMatch = comment.match(/\(Added on: (.*?)\)/);
              const date = dateMatch ? dateMatch[1] : 'N/A';

              const userMatch = comment.match(/\(Added by: (.*?)\)/);
              const email = userMatch ? userMatch[1] : 'Unknown';

              // Map email to user's name
              const userName = userMapping[email] || email; // Use name if available, fallback to email

              const commentText =
                comment
                  .replace(/\(Added on: .*?\)/, '')
                  .replace(/\(Added by: .*?\)/, '')
                  .trim() || 'N/A';

              return (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-md px-4 py-2 shadow-sm"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 mr-4">{userName}</span>
                  <span className="text-xs text-gray-500 mr-4">{date}</span>
                  <span className="text-sm text-gray-700">{commentText}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
CommentSection.propTypes = {
  entityName: PropTypes.string.isRequired,
  Sid: PropTypes.number.isRequired,
};
export default CommentSection;
