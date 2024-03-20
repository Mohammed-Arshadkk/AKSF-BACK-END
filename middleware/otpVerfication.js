const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    console.log(`token:${token}`);
    if (!token || !token.startsWith('Bearer ')) {
      // eslint-disable-next-line max-len
      return res.status(401).json({error: 'Authorization header missing or invalid format'});
    }

    const tokenWithoutBearer = token.split(' ')[1];
    // eslint-disable-next-line max-len
    const decodedToken = jwt.verify(tokenWithoutBearer, process.env.ACCESS_TOKEN);
    console.log(`tok: ${decodedToken}`);
    if (!decodedToken) {
      return res.status(401).json({error: 'Invalid token'});
    }

    req.decodedToken = decodedToken;
    console.log('Decoded token:', req.decodedToken);
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({error: 'Token verification failed'});
  }
};

module.exports = authenticateToken;
