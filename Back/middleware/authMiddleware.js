import { supabase } from '../config/supabaseClient.js';

const authMiddleware = async (req, res, next) => {
  // Get the Bearer token from the authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // If there's no token, return an unauthorized error
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Use Supabase's auth method to get the user associated with the token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    // Check if there was an error or if no user was found
    if (error || !user) {
      console.error('Token verification failed:', error?.message || 'No user found');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Attach the user information to the request object for downstream handlers
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // Catch any unexpected errors during token processing
    console.error('Error in authMiddleware:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Error processing token' });
  }
};

export default authMiddleware;
