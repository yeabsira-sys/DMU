
export const verifyAdmin = (req, res, next) => {
    const isAdmin = req.user.role == 'admin'
    if(!isAdmin) return res.sendStatus(401);
        next();
}