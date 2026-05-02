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
import {getCharacters} from "./Controllers/CharacterController.js";
import {createCampaign} from "./Controllers/DashboardController.js";


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

const getCode = async (req, res, next) => {
    try {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        // Funkcia na vygenerovanie jedného bloku
        const gen = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

        // Finálny formát XXXX-XXXX-XXXX
        const generatedVar = `${gen()}-${gen()}-${gen()}`;

        // Dôležité: Posielame objekt s kľúčom "code", ktorý tvoj frontend očakáva
        return res.status(200).json({
            success: true,
            code: generatedVar
        });

    } catch (error) {
        console.error("Chyba na serveri:", error);
        res.status(500).json({ error: "Nepodarilo sa vygenerovať kód" });
    }
};

//Auth
app.post('/api/auth/register', UserController.register);
app.post('/api/auth/login', UserController.login);

app.get('/campaign/get', verifyToken, DashboardController.getStats);
app.post('/campaign/create', verifyToken, DashboardController.createCampaign);
app.get('/campaign/getcode', verifyToken, getCode);

app.get('/characters',         verifyToken, CharacterController.getCharacters);
app.get('/characters/:id',     verifyToken, CharacterController.getCharacter);
app.post('/characters',        verifyToken, CharacterController.createCharacter);
app.put('/characters/:id',     verifyToken, CharacterController.updateCharacter);
app.delete('/characters/:id',  verifyToken, CharacterController.deleteCharacter);



app.get('/', (req, res) => {
    res.send('The backend is initialized on http://localhost:${PORT}`); 🚀');
});

app.listen(PORT, () => {
    console.log(`🚀 🚀  The backend is initialized on http://localhost:${PORT}`);
    console.log(`🚀 🚀  The Frontend is initialized on http://localhost:${process.env.FrontEnd_PORT}`);
});