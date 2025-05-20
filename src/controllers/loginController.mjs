import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
// import queueEmail from "../queues/emailQueue.mjs";
import { queueEmail } from '../queues/emailJob.mjs'
import {findUserByIdentifier} from '../services/getUser.mjs'

dotenv.config()

export const loginUser = async (req,res)=> {
  try {
    
    const {identifier, password } = req.body;
    const user = await findUserByIdentifier(identifier)
          
          if (!user) return res.status(401).json({"message": "please enter correct username | email or phone number"})
            if (user.status == 'suspended') return res.status(403).json({"message": `${user.userName} has been suspended`})
              if (user.lockUntil && user.lockUntil > Date.now()) {
                return res.status(403).json({ message: 'Account is temporarily locked. Try again later.' });
              }
              const isMatch = await bcrypt.compare(password, user.password);
              
              if(!isMatch) {
                user.failedLoginAttempts += 1;
                if (user.failedLoginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
                  
                  const emailData =  {
                    to: user.email,
                    subject: 'Your DMU Website Account Has Been Closed',
                    html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #b00020;">Account Closed Notification</h2>
                    <p>Dear User,</p>
                    <p>We would like to inform you that your account on the <strong>DMU Website</strong> has been <strong>closed</strong>.</p>
                    
                    <p>This may have occurred due to one of the following reasons:</p>
                    <ul>
                    <li>Multiple unsuccessful login attempts</li>
                    <li>Administrative suspension</li>
                    <li>Violation of usage policies</li>
                    </ul>
                    
                    <p>If you believe this was a mistake or require further assistance, please contact the system administrator or the IT department.</p>
                    
                    <p>Thank you for your understanding.</p>

                    <p>Best regards,<br>
                    Debre Markos University IT Team</p>
                    </div>
                    `      
                  }
                  await queueEmail(emailData);
                  user.lockUntil = new Date(Date.now() + 2  * 60 * 1000);
                  await user.save();
                  return res.status(403).json({ message: 'Account locked due to too many failed attempts. Try again later.' });
                }
                
                await user.save();
                return res.status(400).json({"message": "incorect username or password"});
              }
              
              //reset values on successful logins
              user.failedLoginAttempts = 0;
              user.lockUntil = null;
              user.lastLogin = new Date();
              await user.save();
              
              const secreteUser = { 
                userName: user.userName,
                role: user.role,
                email: user.email,
                id: user._id,
                password: user.password
              }

              const accessToken = jwt.sign(secreteUser,
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
              );
              const payload = {
                accessToken,
                userName: user.userName,
                email: user.email,
                id: user._id,
                role: user.role
              }
    // write refresh token to the user record so it can be used to refresh the access token
    const refreshToken = jwt.sign(secreteUser,
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2d' }
    );
    
    const Now = new Date
    user.refreshToken = refreshToken
    user.lastLogin =  Now.toISOString()
    await user.save();
        req.user = secreteUser
        res.cookie('dmujwtrefreshtoken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        

        //send the access token to the user
        res.status(200).json(payload)
      } catch (error) {
        console.log(error)
        
      }
        
      }