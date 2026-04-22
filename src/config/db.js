const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(' MONGO_URI is not defined. Make sure .env is loaded and contains MONGO_URI.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(' DB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;