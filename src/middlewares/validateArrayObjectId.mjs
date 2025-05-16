export const validateArrayObjectId = (schema) => {
  return async (req, res, next) => {
    const {images} =  req.body;
    if (!images) return res.status(400).json({ message: "image id required" });
      console.log(images, 'from validation' )
    images.map( id => {
      console.log(id)
      const { error } = schema.validate({ id });
      if (error)
        return res.status(400).json({ message: error.details[0].message });
      next();
    }
  )};
};
