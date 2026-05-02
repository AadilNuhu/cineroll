const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('poster'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 400, message: 'No file uploaded' });
  }
  
  // Return the path relative to the server so the frontend can use it
  // Using backticks just in case but usually `/uploads/filename` is fine
  const filePath = `/uploads/${req.file.filename}`;
  
  res.status(200).json({ 
    status: 200, 
    message: 'File uploaded successfully', 
    url: filePath 
  });
});

module.exports = router;
