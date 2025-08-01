import { mongoose } from "../config/db.mjs";

const googleDocLinks = mongoose.Schema({
    name: {type: String, required: true},
    link: { type: String, required: true}
})

export const DocLink = mongoose.model('GoogleDocLinc', googleDocLinks)