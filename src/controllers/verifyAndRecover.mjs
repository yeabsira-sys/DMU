import bcrypt from 'bcryptjs';
import { User } from '../models/User.mjs';
import queueEmail from '../queues/emailQueue.mjs';

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and  code are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.recoveryCode || !user.recoveryCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired reset code.',
       });
    }

    if (parseInt(user.recoveryCode) !== code) {
      return res.status(400).json({ message: 'Incorrect reset code.' });
    }

    if (new Date() > user.recoveryCodeExpires) {
      return res.status(400).json({ message: 'Reset code has expired.' });
    }
    if(newPassword !== confirmPassword) return res.status(400).json({message: 'password must match'})
    const hashedPassword = await bcrypt.hash( newPassword, 10 )    
    user.password = hashedPassword
    const changes = {
      prev: user.password,
      new: hashedPassword
    }
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
const updatedUser = await user.save()
if(!updatedUser) return res.status(400).json({message: 'password could not be changed, pleas try again'})
    user.recoveryCode = 0
    User.recoveryCodeExpires = 0
    await user.save()
    await queueEmail(emailData)
  return res.status(200).json({"message": "password successfuly changed"})
    
  } catch (error) {
    console.error('Error in password reset:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}