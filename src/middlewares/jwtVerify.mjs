import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"message": "unauthorized"});
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN,
        (err, decoded) => {
            if(err) return res.status(403).json({"message": "forbiden"})
            req.user = decoded;
        console.log('from jwt verification : ', decoded)
         next();
        }
    )
   
}