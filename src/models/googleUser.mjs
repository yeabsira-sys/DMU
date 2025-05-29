import { mongoose } from "../config/db.mjs";

const googleUserSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: {type: String, unique: true},
    accessToken: {type: String},
    refreshToken: {type: String},
})

export const GoogleUser = mongoose.model('googleUsers', googleUserSchema)