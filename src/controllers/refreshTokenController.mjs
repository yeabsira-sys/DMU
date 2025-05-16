import  {User} from '../models/User.mjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const refreshToken = async (req,res)=> {
    const { dmujwtrefreshtoken } = req.cookies;
   if(!dmujwtrefreshtoken) return res.sendStatus(401)
    console.log(dmujwtrefreshtoken)
    const refreshToken = dmujwtrefreshtoken;

    const user = await User.findOne({refreshToken})
    if(!user) return res.sendStatus(403)

    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        (err, decoded) => {
            if(err || user.userName !== decoded.userName) return res.status(403);
        }
        )
     const accessToken = jwt.sign(
                { userName: user.userName, role: user.role },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1m' }
            )
        
    

    res.status(200).json({accessToken})


    
}