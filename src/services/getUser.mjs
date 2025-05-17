import { User } from "../models/User.mjs";
export const findUserByIdentifier = async (identifier) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { userName: identifier },
        { phone: identifier }
      ]
    });
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};