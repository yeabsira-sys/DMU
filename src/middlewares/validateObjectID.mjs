export const validateObjectId = (schema) => {
  return async (req, res, next) => {
    let _id
    if(req.params?._id || req.body?._id) 
      _id =  req.params?._id || req.body;
     _id = req.params?.id || req.body?.id;
    if (!_id) return res.status(400).json({ message: "id required" });
      const { error } = schema.validate({ _id });
      if (error)
        return res.status(400).json({ message: error.details[0].message, error });
      next();

  };
};
