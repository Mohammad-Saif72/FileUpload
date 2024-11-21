const e = require('express');
const File = require('../models/File');
const cloudinary = require('cloudinary').v2;
//////////////////////////////////////////////////////////////////////
// local file upload -> handler function
exports.localFileUpload = async (req, res) => {
    try {
        // fetch data
        const file = req.files.file;
        console.log("File aa gyi jee",file);

        // create path where file is going to save on server
        let path = __dirname + '/files/' + Date.now() + `.${file.name.split('.')[1]}`;
        console.log( "PATH->>",path);

        // add path to move function
        file.mv(path, (err) => {
            console.log(err);
        });
        // create a successful response
        res.json({
            success: true,
            message: 'Local File uploaded successfully',
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while uploading file',
            error: error.message,
        });
    }
};
///////////////////////////////////////////////////////////////////////////////////////

function isFileSupported(type,supportedType){
    return supportedType.includes(type);
}

async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath,options);
    
}
// image upload ka handler
exports.imageUpload = async (req, res) => {
   try {
    // data fetch
    const {name,tags,email} = req.body;
    console.log(name,tags,email);

    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportedTypes = ['jpeg', 'png', 'jpg'];
    const fileType = file.name.split('.')[1].toLowerCase();
     

    if(!isFileSupported(fileType,supportedTypes)){
        return res.status(400).json({
            success: false,
            message: 'File format not supported',
        });
    }

    // file format supported hai

    const response = await uploadFileToCloudinary(file,"Saif");
    console.log(response);

    // db mein save karna
    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl: response.secure_url,
    });

    res.json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: response.secure_url,
    });
   } catch (error) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: 'Error while uploading image in cloud',
        error: error.message,
    });
   }
}

///////////////////////////////////////////////////////////////////////////////////////

// video upload ka handler

exports.videoUpload = async (req, res) => {
    try {
        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.videoFile;
        console.log(file);

        // validation
        const supportedTypes = ['mp4',"mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        // add a upper limit of 5MB for video file
        if(file.size > (5*1024*1024)){
            return res.status(400).json({
                success: false,
                message: 'File size is too large',
            });
        }

        if(!isFileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'File format not supported',
            });
        }

        // file format supported hai
    const response = await uploadFileToCloudinary(file,"Saif");
    console.log(response);

    // db mein save karna
    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl: response.secure_url,
    });

    // create a successful response
    res.json({
        success: true,
        message: 'Video uploaded successfully',
        imageUrl: response.secure_url,
    });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while uploading video in cloud',
            error: error.message,
        });
    }
}

///////////////////////////////////////////////////////////////////////
// image size reducer ka handler

exports.imageSizeReducer = async (req, res) => {
    try {
        // data fetch
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        // validation
        const supportedTypes = ['jpeg', 'png', 'jpg'];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        if(!isFileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'File format not supported',
            });
        }

        // file format supported hai

        const response = await uploadFileToCloudinary(file,"Saif",3);
        console.log(response);

        // db mein save karna
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        });

        // create a successful response
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: response.secure_url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error while uploading image in cloud',
            error: error.message,
        });
    }
}