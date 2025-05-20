import  {User}  from '../models/User.mjs';
import bcrypt from 'bcryptjs';
import { generateUserName, generatePassword } from '../utils/userUtils.mjs';
import {queueEmail} from '../queues/emailJob.mjs'


export const createUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(409).json({ message: 'the email is already taken try another one' });
    const trimmedphone = phone.slice(-9)
    const phoneExist = await User.findOne({ phone: trimmedphone });
    if(phoneExist) return res.status(409).json({
      message: "phone number already taken try another one!"
    })
    const userName = generateUserName(name || email|| phone);
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await User.create({
      name,
      email,
      phone: trimmedphone,
      userName,
      password: hashedPassword,
      role,
    });

    const emailData = { 
      to: email,
      subject: 'Your DMU Website Credentials',
      html: `
  <p>Dear ${user.name},</p>
  <p>You have been successfully registered on the <strong>DMU Website</strong>.</p>
  <p><strong>Here are your credentials:</strong></p>
  <ul>
    <li><strong>Username:</strong> ${userName}</li>
    <li><strong>Password:</strong> ${rawPassword}</li>
  </ul>
  <p>Please <strong>log in</strong> and change your password immediately for security purposes.</p>
  <p>Best regards,<br/>Debre Markos University IT Team</p>
`
    }
    // Send email with generated credentials
    await queueEmail(emailData);

    res.status(201).json({ message: 'User created and credentials emailed', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

export const suspendUser = async (req, res) => {

  const { identifier } = req.body

  try {
    const user = await User.findOne({
            $or: [
                {email: identifier},
                {userName: identifier},
                {phone: identifier}
            ]
    })

    if(!user) return res.status(404).json({"message": "user could not be found, incorrect identifier"})

      user.status = "suspended"
      await user.save()
      res.status(200).json({"message": "user suspended"})
  } catch (error) {
    return res.status(500).json({"message":"enternal server error"})
  }
    
}

export const activateUser = async (req, res) => {
  const { identifier } = req.body
  try {
    const user = await User.findOne({
            $or: [
                {email: identifier},
                {userName: identifier},
                {phone: identifier}
            ]
    })

    if(!user) return res.status(404).json({"message": "user could not be found, incorrect identifier"})

      user.status = "active"
      user.lockUntil = null
      user.failedLoginAttempts = 0
      await user.save()
      res.status(200).json({"message": "user activated"})
  } catch (error) {
    return res.status(500).json({"message":"enternal server error"})
  }}


  export const updateUser = async (req, res) => {
  try {
    const { identifier, name, email, phone, role } = req.body;

    const user = await User.findOne({
            $or: [
                {email: identifier},
                {userName: identifier},
                {phone: identifier}
            ]
    })
    if (!user) return res.status(404).json({ message: 'User does not exists' });

     const emailDuplicate = await User.findOne({
      _id: { $ne: user._id }, 
      email: email
    });
    if(emailDuplicate) return res.status(403).json({"message": "email already exist"})
    const phoneDuplicate = await User.findOne({
      _id: { $ne: user._id }, 
      phone: phone
    });
    if(phoneDuplicate) return res.status(403).json({"message": "phone already exist"})
    const trimmedPhone = phone.slice(-9)
    user.name = name
    user.email = email
    user.phone = trimmedPhone
    user.role = role
    
    await user.save()

    const emailData = { 
      to: email,
      subject: 'Your Records Has Been Updated',
      html: `
  <p>Dear ${user.name},</p>
  <p>Your change records successfully registered on the <strong>DMU Website</strong>.</p>
  <p>Best regards,<br/>Debre Markos University IT Team</p>
`
    }
    await queueEmail(emailData);

    res.status(201).json({ message: 'User records updated and notification emailed', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};
