export const requireJsonBody = (req, res, next) => {
    const basePath = req.path.split('/')[1]
    if(basePath === 'file') return next()
  if (req.is('application/json') && typeof req.body === 'object' && req.body !== null) {
    return next();
  }
  return res.status(400).json({
    error: 'Request body must be valid JSON and of type object',
  });
};
