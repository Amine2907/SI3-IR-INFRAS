// sessionMiddleware.js
import { supabase } from '../config/supabaseClient.js';

export const sessionMiddleware = async (req, res, next) => {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers['authorization'];
    const access_token = authHeader && authHeader.split(' ')[1];

    if (!access_token) {
      return res.status(401).json({ error: 'Authorization token missing or invalid' });
    }
    req.access_token = access_token;
    // Retrieve the session using the access token
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // Attach the user to the request object for use in subsequent route handlers
    req.user = data.user;
    next(); // Continue to the route handler
  } catch (error) {
    console.error('Error retrieving session:', error.message);
    res.status(500).json({ error: 'Internal server error while validating session' });
  }
};
