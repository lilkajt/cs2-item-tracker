import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/user.model.js';
import Item from '../models/item.model.js';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Remove existing user if it exists
const clearExistingUser = async (username) => {
  try {
    const result = await User.deleteOne({ username });
    if (result.deletedCount > 0) {
    }
  } catch (error) {
    console.error('Error clearing user:', error);
    process.exit(1);
  }
};

// Add a single user without items
const addUserWithoutItems = async () => {
  try {
    // User data for user without items
    const userData = {
      username: "demouser",
      email: "demo@example.com",
      password: "Password123!",
      status: "active"
    };
    
    // Clear existing user with same username
    await clearExistingUser(userData.username);
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(userData.password);
    
    // Create user with hashed password
    const user = await User.create({
        ...userData,
        password: hashedPassword
    });
    
    console.log(`Demo user created successfully: ${user.username} (${user._id})`);
    return user;
  } catch (error) {
    console.error('Error creating demo user:', error);
    process.exit(1);
  }
};

// Add a single user with items
const addUserWithItems = async () => {
  try {
    // User data for user with items
    const userData = {
      username: "itemuser",
      email: "items@example.com",
      password: "Password456!",
      status: "active"
    };
    
    // Clear existing user with same username
    await clearExistingUser(userData.username);
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(userData.password);
    
    // Create user with hashed password
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    
    console.log(`Item user created successfully: ${user.username} (${user._id})`);
    
    // Read items data
    const itemsDataPath = path.join(__dirname, './data/items.json');
    const itemsData = JSON.parse(fs.readFileSync(itemsDataPath, 'utf8'));
    
    // Create items and associate them with this user
    if (itemsData.length > 0) {
      const createdItems = await Item.insertMany(
        itemsData.map(item => ({
          ...item,
          userId: user._id,
          isDeleted: false,
          deletedAt: null
        }))
      );
      
      console.log(`${createdItems.length} items created for user ${user.username}`);
    }
    
    return user;
  } catch (error) {
    console.error('Error creating user with items:', error);
    process.exit(1);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Add a user without items
    const demoUser = await addUserWithoutItems();
    
    // Add a user with items
    const itemUser = await addUserWithItems();
    
    console.log('Seeding completed successfully!');
    
    return {
      demoUser,
      itemUser
    };
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seed function
connectDB().then(() => {
  seedDatabase();
});