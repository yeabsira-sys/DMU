export const verifyAdminOrCDA = (req, res, next) => {
    const isAdmin = req.user.role == 'admin' || req.user.role == 'cda'
    if(!isAdmin) return res.sendStatus(401);
        next();
}