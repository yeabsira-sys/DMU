import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()
const MONGO_URI = process.env.MONGO_URI;

// const connectDB = async () => {
// try {
//     const conn = await mongoose.createConnection(MONGO_URI, {
//     serverSelectionTimeoutMS: 5000,
//     maxPoolSize: 10
// })
// .then(() => {console.log('data base connected')})
// }catch( err ) {
//     console.error('connection error', err)
//     process.exit(1)
// }}
const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected')
        return conn.connection.db;
    } catch (error) {
        console.error('server down ', error)
    }
  };

export default connectDB;