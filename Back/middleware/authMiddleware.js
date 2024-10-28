// authMiddleware.js
import { supabase } from '../config/supabaseClient.js';
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the Bearer token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Error processing token' });
  }
};
export default authMiddleware;
