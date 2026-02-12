import mongoose from 'mongoose';

let dbConnected = false;
let reconnectTimer;

const getMongoUri = () => process.env.MONGODB_URI || process.env.MONGO_URI;

const startReconnectLoop = () => {
  if (reconnectTimer) return;

  reconnectTimer = setInterval(async () => {
    if (dbConnected) return;

    try {
      const mongoUri = getMongoUri();
      if (!mongoUri) {
        console.error('MongoDB reconnect skipped: MONGODB_URI/MONGO_URI is missing');
        return;
      }

      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      });
      dbConnected = true;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      clearInterval(reconnectTimer);
      reconnectTimer = undefined;
    } catch (error) {
      console.error(`MongoDB reconnect failed: ${error.message}`);
    }
  }, 10000);
};

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    console.error('MongoDB Error: MONGODB_URI/MONGO_URI is missing');
    startReconnectLoop();
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    dbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    dbConnected = false;
    console.error(`MongoDB Error: ${error.message}`);
    console.error('API will return 503 until MongoDB is reachable. Ensure Atlas network access/IP whitelist includes your Render outbound IP or allow 0.0.0.0/0.');
    startReconnectLoop();
  }
};

export const isDbConnected = () => dbConnected;

mongoose.connection.on('connected', () => {
  dbConnected = true;
});

mongoose.connection.on('disconnected', () => {
  dbConnected = false;
  startReconnectLoop();
});

export default connectDB;
