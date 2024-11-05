/**
 * Handles the update of a user's password.
 *
 * This function retrieves the new password from the request body,
 * checks if there is an active session, and attempts to update
 * the user's password using the session's access token.
 * Responds with appropriate HTTP status codes and messages based
 * on the success or failure of the operation.
 *
 * @param {Object} req - The HTTP request object containing the new password.
 * @param {Object} res - The HTTP response object used to send back the result.
 */
import { supabase } from '../config/supabaseClient.js'
import { updatePassword, getSession } from './authController.js'
// Function to handle the update of a user's password 
export const handleUpdatePassword = async (req, res) => {
  const { newPassword, accessToken ,  refresh_token} = req.body;
  console.log('Received data:', { newPassword, accessToken,refresh_token }); // Log input data for debugging
  // Validate the new password
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
  }
  try {
    console.log('Attempting to set session with access token:', accessToken)
    const { error: sessionError } = await supabase.auth.setSession({ access_token: accessToken , refresh_token: refresh_token  });
    
    if (sessionError) {
      console.error('Session error:', sessionError.message);
      return res.status(401).json({ success: false, error: 'Invalid access token.' });
    }
    // Use the access token to get the user
    const { data, error: userError } = await supabase.auth.getUser();
    // Check for user retrieval errors
    if (userError) {
      console.error('Error getting user:', userError.message);
      return res.status(401).json({ success: false, error: userError.message });
    }
    // Ensure a user is returned
    if (!data.user) {
      return res.status(401).json({ success: false, error: 'Invalid access token.' });
    }
    // Update the user’s password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    // Check for update errors
    if (error) {
      console.error('Update error:', error);
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};
// Function to handle the get of a user's session
export const handleGetSession = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error.message)
      return res.status(500).json({ success: false, message: 'Failed to retrieve session' })
    }
    if (data.session) {
      // Session exists
      res.status(200).json({
        success: true,
        session: {
          user: data.session.user,
          expires_at: data.session.expires_at,
          access_token: data.session.access_token
        }
      })
    } else {
      // No active session
      res.status(401).json({ success: false, message: 'No active session' })
    }
  } catch (error) {
    console.error('Unexpected error in handleGetSession:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}