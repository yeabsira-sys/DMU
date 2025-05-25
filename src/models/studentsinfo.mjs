import { mongoose } from '../config/db.mjs';

const studentsInfoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    file: { type: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, required: true },
            uri: { type: String, required: true },
            name: { type: String },
            type: { type: String }, 
        }
    ] },
})

export const StudentsInfo = mongoose.model('StudentsInfo', studentsInfoSchema);