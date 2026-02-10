import mongoose from "mongoose";


const connectDatabase = async ()=>{
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected!! DB host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Error connecting to Mongo database", error);
    process.exit(1);
  }
}

export default connectDatabase;