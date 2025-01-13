import mongoose from 'mongoose';

const connectToDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI; 
  try {
    await mongoose.connect(mongoURI!, {
      maxPoolSize: 10,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;