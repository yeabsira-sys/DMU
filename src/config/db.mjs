import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('database connected')
        return conn.connection.db;
    } catch (error) {
        console.error('server down ', error)
    }
  };
export { mongoose}
export default connectDB;