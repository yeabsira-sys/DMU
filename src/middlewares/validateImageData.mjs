export const validateImageData = (schema) => {
  return (req,res,next)=> {
    const files = req.files
    if (!files) return res.status(400).json({ message: 'No file uploaded' });
    files.map((file) => {
      const {error} = schema.validate({file})
      if(!error) return res.status(400).json({
        message: error.details[0].details
      })
    })
  next();
}};
