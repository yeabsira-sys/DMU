import  {User} from '../models/User.mjs'

export const logout = async (req,res)=> {
    const { dmujwtrefreshtoken } = req.cookies;
   if(!dmujwtrefreshtoken) return res.sendStatus(204) //no content
    const refreshToken = dmujwtrefreshtoken;

    const user = await User.findOne({refreshToken})
    if(!user) return res.sendStatus(403)
    
    const logoutUser = await User.findOneAndUpdate(
  { _id: user._id },
  { $unset: { refreshToken: 1 } },
  { new: true } 
);
console.log(logoutUser)

    if(logoutUser?.refreshToken) return res.sendStatus(500)

      // res.clearCookie()
    res.sendStatus(200);

    
}
