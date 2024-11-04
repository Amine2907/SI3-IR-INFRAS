/**
 * Express middleware that verifies a Bearer token in the Authorization header
 * and attaches the authenticated user and session to the request object.
 * If the token is invalid or no user is found, a 401 Unauthorized response is returned.
 * @function
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next middleware or route handler in the chain
 * @returns {Promise<void>}
 */
import { supabase } from '../config/supabaseClient.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession(token);

    if (userError || sessionError || !user) {
      console.error('Token verification failed:', userError?.message || sessionError?.message || 'No user or session found');
      return res.status(401).json({ error: 'Unauthorized: Invalid token or session' });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error('Error in authMiddleware:', err.message);
    return res.status(401).json({ error: 'Unauthorized: Error processing token' });
  }
};

export default authMiddleware;

