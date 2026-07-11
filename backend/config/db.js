// backend/config/db.js
const mongoose = require('mongoose');
const dns = require('node:dns/promises');

dns.setServers(['1.1.1.1', '1.0.0.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
