import mongoose from "mongoose";

let isConnected = false;

const dbConn = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = connection.connections[0].readyState === 1;

    console.log(
      `MongoDB Connected: ${connection.connection.host}/${connection.connection.name}`,
    );

    return connection;
  } catch (err) {
    isConnected = false;

    console.error("MongoDB connection failed:", err.message);

    throw err;
  }
};

export default dbConn;
