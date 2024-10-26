const express = require('express');
const multer = require('multer'); // For handling multipart/form-data
const { UTApi, UTFile } = require('uploadthing/server');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Initialize Uploadthing API
const utapi = new UTApi({
  apiKey: process.env.UPLOADTHING_TOKEN, // Use the token from the environment
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

    // Create a new UTFile instance from the uploaded file
    const fileToUpload = new UTFile([req.file.buffer], req.file.originalname);

    // Upload the file using the Uploadthing API
    const uploadResponse = await utapi.uploadFiles([fileToUpload]);

    console.log("Upload Response:", uploadResponse); // Log the full response for inspection

    // Extract the URL from the response
    const uploadedPictureUrl = uploadResponse[0]?.data?.url; // Corrected line to access the URL

    if (uploadedPictureUrl) {
      res.status(200).json({ url: uploadedPictureUrl });
      console.log("Uploaded Picture URL:", uploadedPictureUrl);
    } else {
      console.error("File URL is undefined in upload response.");
      res.status(500).json({ message: 'File uploaded but URL is undefined' });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Export the upload router
module.exports = router;
