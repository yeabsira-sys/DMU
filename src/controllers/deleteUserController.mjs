import { User } from '../models/User.mjs'
import bcrypt from 'bcryptjs'

export const deleteUserController = async (req, res) => {
    const {identifier, password} = req.body
    try {
        
        const user = await User.findOne({
                    $or: [
                        {email: identifier},
                        {userName: identifier},
                        {phone: identifier}
                    ]
            })
    
            if(!user) return res.status(400).json({
                message: 'user could not be found to delete'
            })
            const isMatch = await bcrypt.compare(password, req.user.password);
            if(!isMatch) return res.status(400).json({
                message: 'incorrect password! please enter correct password'
            })
            const dbRes = await User.deleteOne({
                $or: [
                        {email: identifier},
                        {userName: identifier},
                        {phone: identifier}
                    ]
            })
            if(dbRes.deletedCount == 0){
                const changes = {
                    prev: user,
                    new: undefined
                }
                req.changes = changes
                return res.status(500).json({
                message: 'user could not be deleted'
            })
        } 
        res.status(200).json({
            message: `user: ${identifier} deleted successfully`
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'internal server error!: user could not be deleted'
        })
    }

}