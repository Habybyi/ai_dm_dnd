import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    UserName:  { type: String, required: true, unique: true },
    UserEmail:     { type: String, required: true, unique: true },
    UserPassword:  { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema)
export default User;