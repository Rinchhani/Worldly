import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/worldly';

  try {
    // Attempt standard connection first with a 3-second timeout
    console.log(`📡 Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`⚠️ Could not connect to primary MongoDB (${err.message}).`);

    // In development or test, fall back to in-memory MongoDB server
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Initializing in-memory MongoDB server fallback for local testing...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memUri = mongoMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`✅ In-memory MongoDB running at: ${memUri}`);
        console.log('💡 Note: Data is persisted in memory while the server runs. Provide MONGODB_URI in .env to use persistent database.');
      } catch (memErr) {
        console.error('❌ Failed to start in-memory MongoDB fallback:', memErr.message);
        throw err;
      }
    } else {
      throw err;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

