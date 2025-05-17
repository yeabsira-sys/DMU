export const validateNewsSearch = schema => {
return async ( req, res, next ) => {
    if(!req.params) return res.status(400).json({message: 'no filters inserted'})
        const data = (({title, author, fromDate, toDate, postedBy, isHidden, socialMediaPosted, editedBy, description, page, limit, adminLoked, cdaLoked}) => ({title, author, fromDate, toDate, postedBy, isHidden, socialMediaPosted, editedBy, description, page, limit, adminLoked, cdaLoked}))(req.query)
    console.log(data)
        const { error } = schema.validate(data) 
    if(error) return res.status(400).json({
        message: error.details[0].message
    })
    next();
}}