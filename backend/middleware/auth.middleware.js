const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    if (!decoded.userId || typeof decoded.userId !== 'string') {
      throw new Error('Invalid token payload');
    }

    const bufferTime = 60;
    if (decoded.exp && decoded.exp - bufferTime < Date.now() / 1000) {
      throw new Error('Token is about to expire');
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;