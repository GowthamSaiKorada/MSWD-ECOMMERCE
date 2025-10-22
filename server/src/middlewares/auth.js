// server/src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies && req.cookies.token ? req.cookies.token : null;

    if (!authHeader && !cookieToken) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    let token;
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Malformed authorization header' });
      }
      token = parts[1];
    } else {
      token = cookieToken;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};
