import mongoose from 'mongoose';

let isConnected = false;

const connectToDB = async () => {
  try {
    if (isConnected) {
      console.log('Already connected to MongoDB.');
      return;
    }


    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: "nuts-ecommerce-db",
    });
    console.log('Connection to MongoDB established.');
    isConnected = true;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export { connectToDB };