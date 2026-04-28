import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const register = async (req, res) => {
    try {
        const {UserName, UserEmail, UserPassword} = req.body;


        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(UserPassword, salt);


        const NewUser = new User({ UserName:UserName, UserPassword: hashedPassword, UserEmail:UserEmail });
        const SavedUser = await NewUser.save();
        console.log(SavedUser)

        const token = jwt.sign(
            { id: SavedUser._id, email: SavedUser.UserEmail },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "Registration sucessfull!",
            token,
            user: {
                id: SavedUser._id,
                name: SavedUser.UserName,
                email: SavedUser.UserEmail
            }
        });
    } catch (er) {
        console.error(er);
        res.status(400).json({
            message: 'Registration failed!',
            error: er.message
        });
    }
}

export const login = async (req, res) => {
    try {
        const { UserEmail, UserPassword } = req.body;
        const user = await User.findOne({ UserEmail });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(UserPassword, user.UserPassword);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.UserEmail },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.UserName }
        });
    } catch (er) {
        console.error(er);
        res.status(500).json({ er : "Server error"})
    }
}