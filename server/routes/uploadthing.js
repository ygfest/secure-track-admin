const express = require('express');
const multer = require('multer'); // For handling multipart/form-data
const { createUploadthing } = require('uploadthing/express');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Initialize Uploadthing with the token from .env
const f = createUploadthing({
  apiKey: process.env.UPLOADTHING_TOKEN, // Use the token from the environment
});

// Create a FileRouter
const uploadRouter = f({
  imageUploader: {
    image: {
      maxFileSize: '4MB',
      maxFileCount: 4,
    },
  },
});

// Define the onUploadComplete callback
uploadRouter.onUploadComplete((data) => {
  console.log('Upload completed:', data);
});

// Create an Express router
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for file uploads

// Route for handling file upload
router.post('/image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Ensure you access the correct upload method from the router
    const uploadResponse = await uploadRouter.imageUploader.upload(req.file.buffer, {
      fileName: req.file.originalname, // Pass the original filename
    });

    // Extract the URL from the response
    const uploadedPictureUrl = uploadResponse.fileUrl;

    res.status(200).json({ url: uploadedPictureUrl });
  } catch (error) {
    console.error('Error uploading image:', error); // Log the full error object
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Export the upload router
module.exports = router;
