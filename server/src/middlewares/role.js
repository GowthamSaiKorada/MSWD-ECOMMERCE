// server/src/middlewares/role.js
module.exports = function role(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowedRoles || allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
