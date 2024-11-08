const express = require('express');
const dbConnect = require('./libs/db');
const authroutes = require('./routes/authroutes');
const dotenv = require('dotenv');
const multer = require('multer'); // Import multer
const cors = require('cors'); // Import CORS
const fs = require("fs");
const path = require("path");
const blogroutes = require('./routes/blogroutes');
const bodyParser = require('body-parser');

// Define the path for the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

dotenv.config();

dbConnect();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(bodyParser.json());


// CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your client's URL
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
})); // This will allow all origins. You can configure it as needed.

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Set the destination for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Customize the filename
    },
  });
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));
app.use('/auth', upload.single('fileInput'), authroutes); // Specify the field name for file uploads
app.use('/blog',blogroutes)

app.listen(PORT, () => {
    console.log(`Server connected at port ${PORT}`);
});
