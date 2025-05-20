export const verifyCDA = (req, res, next) => {
    const isAdmin = req.user.role == 'cda'
    console.log(isAdmin, 'false')
    if(!isAdmin) return res.sendStatus(401);
        next();
}