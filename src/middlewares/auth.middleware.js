import passport from 'passport';

export const requireAuth = (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
    req.user = user;
    next();
  })(req, res, next);
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: 'error', message: 'No autenticado' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'No autorizado' });
    }
    next();
  };
};
