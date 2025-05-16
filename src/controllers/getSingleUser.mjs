import { User } from "../models/User.mjs";
import {
  getUserByID,
  getUserByEmail,
  getUserByPhone,
  getUserByUserName,
} from "../validations/getUserSchema.mjs";

// get user by id
export const getSingleUserByID = async (req, res) => {
  const id = req.params.id;
  const { error, value } = getUserByID.validate({ id });
  console.log(error);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const user = await User.findOne({ _id: id });
  if (!user)
    return res.status(404).json({ message: "user could not be found!" });

  const { name, userName, email, _id, role, phone, status } = user;
  const payload = { name, userName, email, _id, role, phone, status };
  res.status(200).json({
    ResultS: payload,
  });
};

// get user by email
export const getSingleUserByEmail = async (req, res) => {
  const email = req.params.email;
  const { error, value } = getUserByEmail.validate({ email });
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "user could not be found!" });
  } else {
    const { name, userName, email, _id, role, phone, status } = user;
    const payload = { name, userName, email, _id, role, phone, status };
    res.status(200).json({
      ResultS: payload,
    });
  }
};
// get user by userName
export const getSingleUserByUserName = async (req, res) => {
  const userName = req.params.username;
  const { error, value } = getUserByUserName.validate({ userName });
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ userName: userName });
  if (!user) {
    return res.status(404).json({ message: "user could not be found!" });
  } else {
    const { name, userName, email, _id, role, phone, status } = user;
    const payload = { name, userName, email, _id, role, phone, status };
    res.status(200).json({
      ResultS: payload,
    });
  }
};
// get user by phone
export const getSingleUserByPhone = async (req, res) => {
  const phone = req.params.phone;
  const { error, value } = getUserByPhone.validate({ phone });
  if (error) return res.status(400).json({ message: error.details[0].message });
   const trimmedPhone = phone.slice(-9)
  const user = await User.findOne({ phone: trimmedPhone });
  if (!user) {
    return res.status(404).json({ message: "user could not be found!" });
  } else {
    const { name, userName, email, _id, role, phone, status } = user;
    const payload = { name, userName, email, _id, role, phone, status };
    res.status(200).json({
      ResultS: payload,
    });
  }
};
