import mongoose, { mongo } from 'mongoose';

export const connectDB = async ()=>{
 try{
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to MongoDB");

 } catch(error){
     console.error("Error connection in MongoDB",error);
     process.exit(1); // 1 status code meeans fail, 0 means success
 }
}
