// app create 
const express = require('express');
const app = express();

// PORT find karna h
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// middleware use karna h

app.use(express.json());
// file upload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// db se connect karna
const database = require('./config/database');
database.connect();

// cloudinary se connect karna
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

// api route mount karna h
const upload = require('./routes/FileUpload');
app.use('/api/v1/upload', upload);

// server run karna
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
 