export const verifyGoogleAccessToken = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user?.accessToken) {
    return res.status(401).json({ message: 'Google login required' });
  }
  next();
};
