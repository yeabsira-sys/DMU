import { mongoose } from '../config/db.mjs'

const subscriberSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    isActive: { type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: null}
})

export const Subscriber = new mongoose.model('subscriber', subscriberSchema)