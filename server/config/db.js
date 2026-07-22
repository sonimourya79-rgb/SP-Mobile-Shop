const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sp-mobile';
  console.log(
    process.env.MONGO_URI
      ? `MONGO_URI env var is set (${process.env.MONGO_URI.length} chars, starts with "${process.env.MONGO_URI.slice(0, 14)}...")`
      : 'MONGO_URI env var is NOT set - falling back to local default (this is the bug if you see this on Render)'
  );
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = connectDB;
