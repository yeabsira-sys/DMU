export const verifyCDA = (req, res, next) => {
    const isAdmin = req.user.role == 'cda'
    console.log(isAdmin)
    if(!isAdmin) return res.sendStatus(401);
        next();
}