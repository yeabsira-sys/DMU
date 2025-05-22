import { unique } from 'agenda/dist/job/unique'
import { mongoose } from '../config/db.mjs'

const subscriberSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    status: { type: String, enum: ['active', 'inactive']}
})

export const Subscriber = new mongoose.model(subscriberSchema)