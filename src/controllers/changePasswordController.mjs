import bcrypt from "bcryptjs";
import  {User} from '../models/User.mjs'
import dotenv from 'dotenv'
// import queueEmail from "../queues/emailQueue.mjs";
import {queueEmail } from '../queues/emailJob.mjs'

dotenv.config()

export const changePassword = async (req,res)=> {
    const {userName, newPassword, confirmPassword } = req.body;
    const email = req.user?.email
    if(newPassword !== confirmPassword) return res.status(400).json({message: 'password must match'})
    const hashedPassword = await bcrypt.hash( newPassword, 10 )
    try {
    const user = await User.findOne({email})
    if(user.password == hashedPassword) return res.status(403).json({"message": "previous password is forbiden"})
    
    user.userName = userName
    user.password = hashedPassword
    const changes = {
      prev: user.password,
      new: hashedPassword
    }
    req.changes = changes
    const emailData = {
        to: user.email,
        subject: "you passwor has been changed",
        html: `<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 10px;
      background-color: #f9f9f9;
    }
    .header {
      font-size: 22px;
      color: #c0392b;
      margin-bottom: 10px;
    }
    .body {
      font-size: 16px;
      color: #333;
    }
    .cta {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #2980b9;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"> Password Change Notice</div>
    <div class="body">
      <p>Dear ${user.userName},</p>
      <p>
        We’re writing to inform you that your account password on <strong>Debre Markos University</strong> website has been changed.
      </p>
      <p>Thank you,<br>DMU IT Team</p>
    </div>
    <div class="footer">
      This is an automated message. Please do not reply directly to this email.
    </div>
  </div>
</body>
</html>
` }
        await queueEmail(emailData)
   const updatedUser = await user.save()
  return res.status(200).json({"message": "password successfuly changed"})
    }catch(err) {
        console.log(err)
        return res.status(500).json({"message": "password could mot be changed, enternal server error"})
    }
    
}