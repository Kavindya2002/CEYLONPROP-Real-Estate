const express = require('express');
const router = express.Router();
const { upload, uploadProfilePicture } = require('../controllers/uploadController');

// POST endpoint for uploading profile picture
router.post('/uploadprofilepicture', upload.single('file'), uploadProfilePicture);

module.exports = router;
