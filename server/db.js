import mongoose from 'mongoose';
import dns from 'dns';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });

dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config();

const connectDB = async () => {
    try {
        //console.log("Pripájam sa na:", process.env.MONGO_URL.replace(/:.*@/, ":****@"));
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected ✅');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

export default connectDB;
