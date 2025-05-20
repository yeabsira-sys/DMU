import { User } from '../models/User.mjs';
import queueEmail from '../queues/emailQueue.mjs';
import dotenv from 'dotenv';

dotenv.config();

export const requestPasswordRecovery = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email.' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set code and expiry (e.g., 10 minutes from now)
    user.recoveryCode = resetCode;
    user.recoveryCodeExpires = new Date(Date.now() + 10 * 60 * 1000); 
    await user.save();
    console.log(new Date(Date.now()) < new Date(Date.now() + 10 * 1000))
    const emailData = {
      to: user.email,
      subject: 'DMU Website Password Recovery Code',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Password Recovery</h2>
          <p>Hi ${user.name || 'user'},</p>
          <p>You requested to reset your password. Use the code below to proceed:</p>
          <h3>${resetCode}</h3>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this message.</p>
          <p>Best regards,<br>DMU IT Team</p>
        </div>
      `,
    };

    await queueEmail(emailData);

    return res.status(200).json({ message: 'Password reset code sent to email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
};
