const express = require('express');
const multer = require('multer'); // For handling multipart/form-data
const { createUploadthing } = require('uploadthing/express');

const f = createUploadthing();
const uploadRouter = express.Router();
const upload = multer(); // Configure multer for handling file uploads

// Define the imageUploader with Uploadthing integration
const imageUploader = f({
  image: {
    maxFileSize: '4MB',
    maxFileCount: 4,
  },
}).onUploadComplete((data) => {
  console.log('Upload completed', data);
});

// Set up the upload route
uploadRouter.post('/image', upload.single('image'), async (req, res) => {
  try {
    const uploadedFile = await imageUploader.handler()(req, res);
    
    // Get the URL from the Uploadthing response
    const uploadedPictureUrl = uploadedFile.fileUrl; // Assuming the response structure

    // Respond with the uploaded file URL
    res.status(200).json({ url: uploadedPictureUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

// Exporting the uploadRouter
exports.uploadRouter = uploadRouter;
