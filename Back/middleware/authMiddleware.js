/**
 * Middleware to verify user authentication.
 * Checks for the presence of an authorization token in the request headers.
 * If the token is missing, responds with a 401 Unauthorized status.
 * Otherwise, passes control to the next middleware function.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyAuth = (req, res, next) => {
    // Extract token from the authorization header
    const token = req.headers.authorization?.split(" ")[1];
    
    // If token is absent, respond with 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Proceed to the next middleware
    next();
};
