const mongoose = require('mongoose');
const bcrypt=require("bcrypt")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    fileInput: { 
        type: String, 
        required: false // Changed from required: true to required: false
    },
    verificationCode: {
        type: String,
    },
}, { timestamps: true });


userSchema.methods.verifyPassword = async function (password) {
    // Compare the input password with the stored hashed password
    return await bcrypt.compare(password, this.password);
};
const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;