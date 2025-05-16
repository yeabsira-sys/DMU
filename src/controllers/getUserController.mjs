import { User } from "../models/User.mjs";
import { userSearch } from "../validations/userSearchSchema.mjs";

export const getUserController = async (req, res) => {
  try {
    const { id, name, email, phone, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (id) query.id = id;
    if (name) query.name = { $regex: name, $options: "i" };
    if (email) query.email = email;
    if (phone) query.phone = phone;
    if (status) query.status = status;

    const isValid = userSearch.validate(query);
    if (!isValid)
      return res
        .status(400)
        .json({ message: "incorrect query parameter / filters" });
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      let payload = [];
      if (users && users.length > 0) {
        payload = users.map(({name, userName, email, _id, role, phone, status}) => ({
            name,
            userName,
            email,
            _id,
            role,
            phone,
            status,
        }))
        }
    const total = await User.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results: payload,
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};
