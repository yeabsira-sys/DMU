export const validateObjectId = (schema) => {
  return async (req, res, next) => {
    const _id = req.params?._id || req.body;
    if (!_id) return res.status(400).json({ message: "id required" });
      const { error } = schema.validate({ _id });
      if (error)
        return res.status(400).json({ message: error.details[0].message });
      next();

  };
};
