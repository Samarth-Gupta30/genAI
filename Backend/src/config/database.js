
import mongoose from "mongoose";

const connectToDB = async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("Missing MongoDB connection string (set MONGO_URI or MONGODB_URI)");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
};

export default connectToDB;
