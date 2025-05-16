export const logAction = (action, target) => {
  return async (req, res, next) => {
    const targetId = req.params.id || req.body.id || null;

    res.on('finish', async () => {
      await AuditLog.create({
        action,
        target,
        targetId,
        performedBy: req.user?._id,
        status: res.statusCode >= 400 ? 'FAILED' : 'SUCCESS',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    });

    next();
  };
};
