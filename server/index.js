import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../.env' });
//DataBase
import User from './models/User.js';
import Campaign from './models/Campaign.js';
import Character from './models/Character.js';

import connectDB from './db.js';

// Controllers
import * as UserController from './Controllers/UserController.js';
import * as DashboardController from './Controllers/DashboardController.js';
import * as CharacterController from './Controllers/CharacterController.js';


//Port for backend
const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cors({
    origin: `http://localhost:${process.env.FrontEnd_PORT}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Token is required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};


//Auth
app.post('/api/auth/register', UserController.register);
app.post('/api/auth/login', UserController.login);

app.get('/dashboard', verifyToken, DashboardController.getStats);

app.post('/character/create', verifyToken, CharacterController.createCharacter);



app.get('/', (req, res) => {
    res.send('The backend is initialized on http://localhost:${PORT}`); 🚀');
});

app.listen(PORT, () => {
    console.log(`🚀 🚀  The backend is initialized on http://localhost:${PORT}`);
    console.log(`🚀 🚀  The Frontend is initialized on http://localhost:${process.env.FrontEnd_PORT}`);
});