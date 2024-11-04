const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://vercel-admin-user:37gL9NDemNr08Ikg@cluster0.albqgvh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
