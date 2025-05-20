// import { User } from "../models/User.mjs";

// export const actorLogin = async (req, res, next) => {
//     const {identifier} = req.body;
//     const hostname = req.hostname
//     if(!hostname) return res.status(400).json({
//         message: 'Can Not get resources! please turnoff VPN and try again!'
//     })
//     const role = hostname.split('.')[0];
//     try {
//         const user = await User.findOne({
//                 $or: [
//                     {email: identifier},
//                     {userName: identifier},
//                     {phone: identifier}
//                 ]
//         })

//         if(user && user.role !== role) return res.status(403).json({"message": "forbiden login attempt"})
//             next()
//     } catch (error) {
//         console.log(error)      
//         return res.sendStatus(500)
//     }
    

// }