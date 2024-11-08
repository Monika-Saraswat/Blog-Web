const { sendverificationcode, Welcomeemail } = require("../middleware/email");
const { Welcome_Email_Template } = require("../middleware/emailtemplate");
const UserModel = require("../models/User");
const bcrypt = require('bcrypt');
const path = require('path');
const { generateToken } = require('../utils/jwt.utils');

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body; // No need to destructure fileInput here
        const fileInput = req.file; // Get the uploaded file

        // Validate required fields
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the email already exists
        const existEmail = await UserModel.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ success: false, message: "Email ID already exists" });
        }

        // Check if the username already exists
        const existUsername = await UserModel.findOne({ username });
        if (existUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Prepare the file path (if a file was uploaded)
        let filePath = null;
        if (fileInput) {
            filePath = fileInput.path; // Assuming you are using multer with disk storage
        }

        // Create a new user
        const user = new UserModel({
            email,
            password: hashedPassword,
            username,
            fileInput: filePath, // Store the file path
            verificationCode
        });

        // Save the user to the database
        await user.save();

        // Send verification email
        sendverificationcode(user.email, verificationCode); // Ensure this function is correctly defined
        return res.status(200).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error(error); // Use console.error for errors
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await UserModel.findOne({
            verificationCode: code
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or Expired Code" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        await Welcomeemail(user.email, user.username);
        return res.status(200).json({ success: true, message: "Email Verified successfully",user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    // console.log(username,password)
    try {
        const user = await UserModel.findOne({ username });
        if (!user || !(await user.verifyPassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        if (user && user.isVerified === false) {
            return res.status(400).json({ message: 'User is not verified', code: 'NOT_VERIFIED' });
        }

        const token = generateToken(user._id);
        console.log(token)
        res.status(200).json({ token ,user});
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server error" });
    }
};



module.exports = { verifyEmail, register,login };
